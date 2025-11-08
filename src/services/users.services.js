const db = require('../models/index.js')
const { tokenType } = require('../constants/enum.js')
const { generateToken } = require('../utils/jwt.js')
const { AppError } = require('../controllers/error.controllers.js')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js')
const { USER_MESSAGES } = require('../constants/message.js')
const HTTP_STATUS = require('../constants/httpStatus.js')

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
    const { dataValues: user } = await db.User.findOne({ where: { email } })
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
}
module.exports = new UserServices()
