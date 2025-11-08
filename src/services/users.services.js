const db = require('../models/index.js')
const { tokenType } = require('../constants/enum.js')
const { generateToken, verifyToken } = require('../utils/jwt.js')
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
        tokenType: tokenType.ResetPasswordToken
      },
      process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN || '5m'
    )
  }

  async refreshToken(userId, refreshTokenStr) {
    const decodedRefreshToken = await verifyToken(refreshTokenStr)
    if (!decodedRefreshToken || decodedRefreshToken.tokenType !== tokenType.RefreshToken) {
      throw new AppError(USER_MESSAGES.REFRESH_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(userId.toString()),
      this.signRefreshToken(userId.toString())
    ])

    await db.User.update(
      {
        refreshToken: newRefreshToken,
        updatedAt: new Date()
      },
      { where: { userId } }
    )

    return { accessToken, refreshToken: newRefreshToken }
  }

  async checkEmailExists(email) {
    const user = await db.User.findOne({ where: { email } })
    return !!user
  }

  async getUserByEmail(email) {
    const data = await db.User.findOne({ where: { email } })
    if (!data) return null
    const { password, accessTokenForgotPassword, ...user } = data.get({ plain: true })
    return user
  }

  async getUserById(userId) {
    const data = await db.User.findOne({ where: { userId } })
    if (!data) return null
    const { password, accessTokenForgotPassword, ...restUser } = data.get({ plain: true })
    return restUser
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
    await db.User.update(
      {
        refreshToken,
        updatedAt: new Date()
      },
      {
        where: { userId: user.userId }
      }
    )
    const { password: _, accessTokenForgotPassword, ...restUser } = user
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

  async changePassword({ userId, currentPassword, newPassword }) {
    if (!comparePassword(currentPassword, newPassword)) {
      throw new AppError(USER_MESSAGES.OLD_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    await db.User.update(
      {
        password: hashPassword(newPassword),
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    return true
  }

  async updateProfile(userId, body) {
    await db.User.update(body, { where: { userId } })
    const updatedUser = await this.getUserById(userId)
    return updatedUser
  }

  async changePassword(user_id, plainTextPassword) {}

  async getUsers({ search, page, limit, sortBy, sortOrder, isActive, role }) {
    const offset = (page - 1) * limit
    const whereClause = {}
    if (isActive !== undefined) {
      whereClause.isActive = isActive
    }
    if (role) {
      whereClause.role = role
    }
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { firstName: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { lastName: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { email: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ]
    }
    const orderClause = []
    if (sortBy) {
      orderClause.push([sortBy, sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'])
    } else {
      orderClause.push(['createdAt', 'DESC'])
    }

    const { rows: users, count: total } = await db.User.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes: { exclude: ['password', 'refreshToken', 'accessTokenForgotPassword'] }
    })

    return {
      data: users,
      pagination: {
        total: +total,
        page: +page,
        limit: +limit
      }
    }
  }
  async deleteUser(userId) {
    await db.User.update(
      {
        isActive: false,
        updatedAt: new Date()
      },
      { where: { userId } }
    )
    return true
  }
}
module.exports = new UserServices()
