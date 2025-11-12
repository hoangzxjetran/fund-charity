const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { FUND_MESSAGES, CAMPAIGN_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const { parseISO, isBefore } = require('date-fns')

const getCharityCampaignValidator = validate(
  checkSchema({
    fundId: {
      in: ['params'],
      exists: {
        errorMessage: FUND_MESSAGES.FUND_ID_REQUIRED
      },
      isInt: {
        errorMessage: FUND_MESSAGES.FUND_ID_INVALID
      },
      toInt: true
    }
  })
)

const createCampaignValidator = validate(
  checkSchema({
    fundId: {
      in: ['params'],
      exists: {
        errorMessage: FUND_MESSAGES.FUND_ID_REQUIRED
      },
      isInt: {
        errorMessage: FUND_MESSAGES.FUND_ID_INVALID
      },
      toInt: true
    },
    campaignName: {
      in: ['body'],
      exists: {
        errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_NAME_REQUIRED
      },
      isString: {
        errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_NAME_MUST_BE_STRING
      },
      notEmpty: {
        errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_NAME_NOT_EMPTY
      },
      trim: true
    },
    startDate: {
      optional: true,
      isISO8601: {
        options: {
          strictSeparator: true,
          strict: true
        },
        errorMessage: FUND_MESSAGES.START_DATE_INVALID
      }
    },
    endDate: {
      optional: true,
      isISO8601: {
        options: {
          strictSeparator: true,
          strict: true
        },
        errorMessage: FUND_MESSAGES.START_DATE_INVALID
      },
      custom: {
        options: (value, { req }) => {
          const start = parseISO(req.body.startDate)
          const end = parseISO(value)
          if (isBefore(end, start)) {
            throw new AppError(FUND_MESSAGES.END_DATE_BEFORE_START_DATE)
          }
          return true
        }
      }
    },
    location: {
      optional: true,
      isString: {
        errorMessage: CAMPAIGN_MESSAGES.LOCATION_MUST_BE_STRING
      },
      trim: true
    },
    description: {
      optional: true,
      isString: {
        errorMessage: CAMPAIGN_MESSAGES.DESCRIPTION_MUST_BE_STRING
      },
      trim: true
    }
  })
)

const charityCampaignIdValidator = validate(
  checkSchema(
    {
      campaignId: {
        notEmpty: {
          errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_REQUIRED
        },
        isInt: {
          errorMessage: CAMPAIGN_MESSAGES.CAMPAIGN_ID_INVALID
        },
        toInt: true
      }
    },
    ['params']
  )
)

module.exports = {
  getCharityCampaignValidator,
  charityCampaignIdValidator,
  createCampaignValidator
}
