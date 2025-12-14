const { checkSchema } = require('express-validator')
const { CAMPAIGN_MESSAGES, COMMON, DONATION_MESSAGES } = require('../constants/message')
const validate = require('../utils/validate')
const { parseISO, isBefore } = require('date-fns')
const { AppError } = require('../controllers/error.controllers')
const HTTP_STATUS = require('../constants/httpStatus')

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
      },
      startDate: {
        optional: true,
        isISO8601: { errorMessage: DONATION_MESSAGES.START_DATE_INVALID }
      },
      endDate: {
        optional: true,
        isISO8601: { errorMessage: DONATION_MESSAGES.END_DATE_INVALID },
        custom: {
          options: (value, { req }) => {
            const startDate = req.query.startDate ? parseISO(req.query.startDate) : new Date()
            const endDate = parseISO(value)
            if (isBefore(endDate, startDate)) {
              throw new AppError(DONATION_MESSAGES.END_DATE_MUST_BE_AFTER_START_DATE, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
const getTop5DonationsValidator = validate(
  checkSchema({
    includeAnonymous: {
      in: ['query'],
      optional: true,
      isBoolean: {
        errorMessage: DONATION_MESSAGES.INCLUDE_ANONYMOUS_INVALID
      },
      toBoolean: true
    }
  })
)

const getTop5DonationsByCampaignValidator = validate(
  checkSchema(
    {
      campaignId: {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_REQUIRED },
        isInt: { errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_INVALID }
      },
      includeAnonymous: {
        in: ['query'],
        optional: true,
        isBoolean: {
          errorMessage: DONATION_MESSAGES.INCLUDE_ANONYMOUS_INVALID
        },
        toBoolean: true
      }
    },
    ['params']
  )
)
module.exports = {
  campaignIdValidator,
  getDonationsValidator,
  getTop5DonationsValidator,
  getTop5DonationsByCampaignValidator
}
