const { checkSchema } = require('express-validator')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { TRANSACTION_MESSAGES, COMMON } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const validate = require('../utils/validate.js')

const getTransactionsValidator = validate(
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
        custom: {
          options: (value) => {
            const validSortByFields = ['createdAt', 'amount', 'typeId', 'balanceBefore', 'balanceAfter']
            if (!validSortByFields.includes(value)) {
              throw new AppError(COMMON.SORT_BY_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      sortOrder: {
        optional: true,
        custom: {
          options: (value) => {
            const lowerCased = value.toLowerCase()
            if (lowerCased !== 'asc' && lowerCased !== 'desc') {
              throw new AppError(COMMON.SORT_ORDER_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      walletId: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: TRANSACTION_MESSAGES.WALLET_ID_INVALID
        },
        toInt: true
      },
      search: {
        optional: true,
        trim: true
      },
      type: {
        optional: true,
        custom: {
          options: (value) => {
            const validTypes = ['donation', 'withdrawal']
            if (!validTypes.includes(value)) {
              throw new AppError(TRANSACTION_MESSAGES.TYPE_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      }
    },

    ['query']
  )
)
module.exports = {
  getTransactionsValidator
}
