const { checkSchema } = require('express-validator')
const { CAMPAIGN_MESSAGES, COMMON } = require('../constants/message')
const validate = require('../utils/validate')

const campaignIdValidator = validate(
  checkSchema(
    {
      campaignId: {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_REQUIRED },
        isInt: { errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_INVALID }
      }
    },
    ['params']
  )
)

const getDonationsValidator = validate(
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
        trim: true
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['orgName', 'createdAt']],
          errorMessage: COMMON.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: COMMON.SORT_ORDER_INVALID
        }
      }
    },
    ['query']
  )
)
module.exports = {
  campaignIdValidator,
  getDonationsValidator
}
