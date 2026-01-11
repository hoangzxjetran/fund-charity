const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { COMMON, USER_MESSAGES, FRIEND_REQUEST_MESSAGES } = require('../constants/message')
const HTTP_STATUS = require('../constants/httpStatus')
const { AppError } = require('../controllers/error.controllers')

const getListFriendValidator = validate(
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
      search: {
        optional: true,
        trim: true,
        isString: { errorMessage: COMMON.SEARCH_MUST_BE_STRING }
      }
    },
    ['query']
  )
)

const getListFriendRequestValidator = validate(
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
      }
    },
    ['query']
  )
)

const friendRequestIdValidator = validate(
  checkSchema(
    {
      requestId: {
        notEmpty: { errorMessage: FRIEND_REQUEST_MESSAGES.REQUEST_ID_REQUIRED },
        isInt: { errorMessage: FRIEND_REQUEST_MESSAGES.REQUEST_ID_INVALID },
        toInt: true
      }
    },
    ['params']
  )
)

const sendRequestValidator = validate(
  checkSchema(
    {
      receiverId: {
        notEmpty: { errorMessage: USER_MESSAGES.USER_ID_REQUIRED },
        isInt: { errorMessage: USER_MESSAGES.USER_ID_INVALID },
        toInt: true
      }
    },
    ['body']
  )
)

module.exports = {
  getListFriendValidator,
  getListFriendRequestValidator,
  sendRequestValidator,
  friendRequestIdValidator
}
