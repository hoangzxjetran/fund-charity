const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { USER_MESSAGES, COMMON } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const HTTP_STATUS = require('../constants/httpStatus')

const getWalletByUserIdValidator = validate(
  checkSchema({
    userId: {
      in: ['params'],
      exists: {
        errorMessage: USER_MESSAGES.USER_ID_REQUIRED
      },
      isInt: {
        options: { min: 1 },
        errorMessage: USER_MESSAGES.USER_ID_INVALID
      },
      toInt: true
    }
  })
)

const getWalletsValidator = validate(
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
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['balance', 'createdAt']],
          errorMessage: COMMON.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: CAMPAIGN_MESSAGES.SORT_ORDER_INVALID
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(walletStatus)],
          errorMessage: CAMPAIGN_MESSAGES.STATUS_INVALID
        },
        isInt: {
          errorMessage: CAMPAIGN_MESSAGES.STATUS_INVALID
        },
        toInt: true
      }
    },
    ['query']
  )
)

module.exports = {
  getWalletByUserIdValidator
}
