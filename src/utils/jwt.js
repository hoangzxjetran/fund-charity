const AppError = require('../controllers/error.controllers.js')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { USER_MESSAGES } = require('../constants/message.js')
const pkg = require('jsonwebtoken')
const { JsonWebTokenError } = pkg
dotenv.config()

const generateToken = (payload, expiresIn) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn, algorithm: 'HS256' }, (err, token) => {
      if (err) {
        throw reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decoded
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED)
    }
    throw error
  }
}

module.exports = {
  generateToken,
  verifyToken
}
