const HTTP_STATUS = require('../constants/httpStatus.js')

const errorMiddleware = (err, req, res, next) => {
  const customError = err
  const status =
    customError?.status && String(customError.status).startsWith('4')
      ? customError.status
      : HTTP_STATUS.INTERNAL_SERVER_ERROR
  const statusCode = customError.statusCode || 'error'
  const message = customError.message || 'Internal Server Error'
  res.status(status).json({
    status,
    statusCode: statusCode,
    message,
    stack: customError.stack
  })
}
module.exports = errorMiddleware
