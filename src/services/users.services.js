const db = require('../models/index.js')
const { tokenType } = require('../constants/enum.js')
const { generateToken } = require('../utils/jwt.js')

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
        tokenType: TokenType.RefreshToken
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
      password
    })
    console.log(newUser)
    return newUser
  }
}
module.exports = new UserServices()
