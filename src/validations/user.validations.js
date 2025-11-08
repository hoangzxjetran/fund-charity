const { checkSchema } = require('express-validator')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { USER_MESSAGES, COMMON } = require('../constants/message.js')
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

const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await usersServices.getUserByEmail(value)
            if (!user) {
              throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

const verifyPasswordTokenValidator = validate(
  checkSchema(
    {
      forgotPasswordToken: {
        notEmpty: {
          errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const decode = await verifyToken(value)
            const user = await usersServices.getUserById(decode.userId)
            if (user?.forgotPasswordToken !== value) {
              throw new AppError(USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

const resetPasswordValidator = validate(
  checkSchema(
    {
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
        trim: true,
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
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH)
            }
            return true
          }
        }
      },
      forgotPasswordToken: {
        notEmpty: {
          errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            if (req?.user?.forgotPasswordToken !== value) {
              throw new AppError(USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

const changePasswordValidator = validate(
  checkSchema(
    {
      currentPassword: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.OLD_PASSWORD_IS_REQUIRED
        }
      },
      newPassword: {
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
      confirmNewPassword: {
        trim: true,
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
            if (value !== req.body.confirmNewPassword) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
const updateProfileValidator = validate(
  checkSchema(
    {
      firstName: {
        optional: true,
        trim: true,
        isLength: { options: { min: 2, max: 30 }, errorMessage: USER_MESSAGES.FIRST_NAME_LENGTH }
      },
      lastName: {
        optional: true,
        trim: true,
        isLength: { options: { min: 2, max: 30 }, errorMessage: USER_MESSAGES.LAST_NAME_LENGTH }
      },
      dateOfBirth: {
        optional: true,
        isISO8601: {
          options: {
            strictSeparator: true,
            strict: true
          },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS8601_INVALID
        }
      },
      phoneNumber: {
        optional: true,
        isMobilePhone: {
          options: 'any',
          errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_INVALID
        },
        trim: true
      },
      avatar: {
        optional: true,
        isURL: {
          errorMessage: USER_MESSAGES.AVATAR_MUST_BE_URL
        },
        trim: true
      }
    },
    ['body']
  )
)

const getUsersValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: COMMON.PAGE_INVALID
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            if (value < 1) {
              throw new AppError(COMMON.PAGE_SIZE_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      limit: {
        optional: true,
        isInt: {
          options: { min: 1, max: 100 },
          errorMessage: COMMON.LIMIT_INVALID
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            if (value < 1) {
              throw new AppError(COMMON.LIMIT_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            } else if (value > 100) {
              throw new AppError(COMMON.LIMIT_MAX, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }

            return true
          }
        }
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['firstName', 'lastName', 'email', 'createdAt', 'updatedAt']],
          errorMessage: USER_MESSAGES.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: USER_MESSAGES.SORT_ORDER_INVALID
        }
      },
      isActive: {
        optional: true,
        isBoolean: {
          errorMessage: USER_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN
        },
        toBoolean: true
      },
      role: {
        optional: true,
        isIn: {
          options: [['user', 'admin']],
          errorMessage: USER_MESSAGES.ROLE_INVALID
        }
      },
      search: {
        optional: true,
        trim: true
      }
    },
    ['query']
  )
)

const userIdValidator = validate(
  checkSchema(
    {
      userId: {
        notEmpty: {
          errorMessage: USER_MESSAGES.USER_ID_REQUIRED
        },
        isInt: {
          options: { min: 1 },
          errorMessage: USER_MESSAGES.USER_ID_INVALID
        },
        toInt: true
      }
    },
    ['params']
  )
)

const uploadAvatarValidator = validate(
  checkSchema(
    {
      file: {
        custom: {
          options: (value, { req }) => {
            if (!req.file) {
              throw new AppError(USER_MESSAGES.AVATAR_IS_REQUIRED, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      }
    },
    ['file']
  )
)

module.exports = {
  signUpValidator,
  signInValidator,
  forgotPasswordValidator,
  verifyPasswordTokenValidator,
  resetPasswordValidator,
  changePasswordValidator,
  getUsersValidator,
  updateProfileValidator,
  userIdValidator,
  uploadAvatarValidator
}
