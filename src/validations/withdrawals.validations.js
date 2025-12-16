const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { WALLET_MESSAGES, COMMON } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const { withdrawalStatus } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus')

const createWithdrawalValidator = validate(
  checkSchema(
    {
      amount: {
        required: WALLET_MESSAGES.AMOUNT_REQUIRED,
        isInt: WALLET_MESSAGES.AMOUNT_MUST_BE_NUMBER
      },
      fromWalletId: {
        required: WALLET_MESSAGES.FROM_WALLET_ID_REQUIRED,
        isInt: WALLET_MESSAGES.FROM_WALLET_ID_MUST_BE_NUMBER
      },
      campaignId: {
        required: WALLET_MESSAGES.CAMPAIGN_ID_REQUIRED,
        isInt: WALLET_MESSAGES.CAMPAIGN_ID_MUST_BE_NUMBER
      },
      purpose: {
        require: true,
        isString: {
          errorMessage: WALLET_MESSAGES.PURPOSE_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)
const getAllWithdrawalsValidator = validate(checkSchema({}))
const updateWithdrawalStatusValidator = validate(
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
      status: {
        optional: true,
        custom: {
          options: (value) => {
            const allowedStatuses = Object.values(withdrawalStatus)
            if (!allowedStatuses.includes(value)) {
              throw new AppError(WALLET_MESSAGES.WITHDRAWAL_STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
          }
        }
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['createdAt', 'amount']],
          errorMessage: COMMON.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: COMMON.SORT_ORDER_INVALID
        }
      },
      campaignId: {
        optional: true,
        isInt: WALLET_MESSAGES.CAMPAIGN_ID_MUST_BE_NUMBER
      }
    },
    ['body']
  )
)
module.exports = {
  createWithdrawalValidator,
  getAllWithdrawalsValidator,
  updateWithdrawalStatusValidator
}
