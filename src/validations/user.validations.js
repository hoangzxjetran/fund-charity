const { checkSchema } = require('express-validator')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { USER_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const validate = require('../utils/validate.js')
const usersServices = require('../services/users.services.js')

const signUpValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await usersServices.checkEmailExists(value)
            if (isExist) {
              throw new AppError(USER_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        },
        trim: true
      },
      firstName: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.FIRST_NAME_IS_REQUIRED
        },
        isLength: { options: { min: 2, max: 30 }, errorMessage: USER_MESSAGES.FIRST_NAME_LENGTH }
      },
      lastName: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.LAST_NAME_IS_REQUIRED
        },
        isLength: { options: { min: 2, max: 30 }, errorMessage: USER_MESSAGES.LAST_NAME_LENGTH }
      },
      password: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        }
      },
      confirmPassword: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new AppError(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        },
        trim: true
      },
      dateOfBirth: {
        isISO8601: {
          options: {
            strictSeparator: true,
            strict: true
          },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS8601_INVALID
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)

const signInValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        }
      },
      password: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        }
      }
    },
    ['body']
  )
)

module.exports = { signUpValidator, signInValidator }
