const db = require('../models/index.js')
const { tokenType } = require('../constants/enum.js')
const { generateToken } = require('../utils/jwt.js')
const { AppError } = require('../controllers/error.controllers.js')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js')
const { USER_MESSAGES } = require('../constants/message.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { sendForgotPasswordEmail } = require('../utils/s3-ses.js')

class UserServices {
  signAccessToken(userId) {
    return generateToken(
      {
        userId,
        tokenType: tokenType.AccessToken
      },
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h'
    )
  }
  signRefreshToken(userId, exp) {
    if (exp) {
      return generateToken(
        {
          userId,
          tokenType: tokenType.RefreshToken,
          exp
        },
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
      )
    }
    return generateToken(
      {
        userId,
        tokenType: tokenType.RefreshToken
      },
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
    )
  }
  signForgotPasswordToken(userId) {
    return generateToken(
      {
        userId,
        tokenType: tokenType.RefreshToken
      },
      process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN || '5m'
    )
  }
  async checkEmailExists(email) {
    const user = await db.User.findOne({ where: { email } })
    return !!user
  }

  async getUserByEmail(email) {
    const data = await db.User.findOne({ where: { email } })
    if (!data) return null
    const user = data.get({ plain: true })
    return user
  }

  async getUserById(userId) {
    const data = await db.User.findOne({ where: { userId } })
    if (!data) return null
    const user = data.get({ plain: true })
    return user
  }

  async signUp({ firstName, lastName, dateOfBirth, email, password }) {
    const newUser = await db.User.create({
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashPassword(password)
    })
    return newUser
  }

  async signIn({ email, password }) {
    const foundUser = await db.User.findOne({ where: { email } })
    if (!foundUser) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }

    const { dataValues: user } = foundUser
    if (!user || !comparePassword(password, user?.password)) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user.userId.toString()),
      this.signRefreshToken(user.userId.toString())
    ])
    const { password: _, ...restUser } = user
    return { ...restUser, accessToken, refreshToken }
  }

  async forgotPassword({ userId, email }) {
    const forgotPasswordToken = await this.signForgotPasswordToken(userId.toString())
    await db.User.update(
      {
        accessTokenForgotPassword: forgotPasswordToken,
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    sendForgotPasswordEmail({
      toAddress: email,
      passwordToken: forgotPasswordToken
    })
    return true
  }

  async resetPassword({ userId, plainTextPassword }) {
    await db.User.update(
      {
        password: hashPassword(plainTextPassword),
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    return true
  }

  async changePassword(userId, oldPlainTextPassword, newPlainTextPassword) {
    const user = await this.getUserById(userId)
    if (!comparePassword(oldPlainTextPassword, user.password)) {
      throw new AppError(USER_MESSAGES.OLD_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    await db.User.update(
      {
        password: hashPassword(newPlainTextPassword),
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    return true
  }
  async myProfile(user_id) {}

  async updateMyProfile(user_id, body) {}

  async updateUser(user_id, body) {
    return result
  }
  async refreshToken(user_id) {
    const accessToken = await this.signAccessToken(user_id)
    return accessToken
  }
  async changePassword(user_id, plainTextPassword) {}

  async getListUser({ search, page, limit, sortBy, sortOrder, isActive, role }) {}
  async deleteUser(user_id) {}
}
module.exports = new UserServices()
