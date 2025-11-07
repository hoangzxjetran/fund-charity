const { ErrorEntity } = require('../controllers/error.controllers.js')
const { validationResult } = require('express-validator')

const validate = (validation) => {
  return async (req, res, next) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    const errorObject = errors.mapped()
    const entityError = new ErrorEntity({ errors: {} })
    for (const key in errorObject) {
      const { msg: message } = errorObject[key]
      entityError.message = message
      entityError.errors[key] = message
    }
    next(entityError)
  }
}
module.exports = validate
