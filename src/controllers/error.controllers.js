const HTTP_STATUS = require('../constants/httpStatus.js')
const { USER_MESSAGES } = require('../constants/message.js')
class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status || 500
    this.statusCode = `${this.status}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}

class ErrorWithStatus {
  constructor(message, status) {
    this.message = message
    this.status = status
  }
}
class ErrorEntity extends ErrorWithStatus {
  constructor({ message = USER_MESSAGES.VALIDATION_ERROR, errors }) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY)
    this.errors = errors
  }
}
module.exports = {
  AppError,
  ErrorEntity,
  ErrorWithStatus
}
