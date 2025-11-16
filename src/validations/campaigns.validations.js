const { checkSchema } = require('express-validator')
const { FUND_MESSAGES, CAMPAIGN_MESSAGES, ORGANIZATION_MESSAGES, COMMON } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const { parseISO, isBefore } = require('date-fns')
const validate = require('../utils/validate')
const HTTP_STATUS = require('../constants/httpStatus')
const organizationsServices = require('../services/organizations.services')
const { campaignStatus } = require('../constants/enum')
const orgIdValidator = validate(
  checkSchema(
    {
      orgId: {
        notEmpty: { errorMessage: ORGANIZATION_MESSAGES.ORG_ID_REQUIRED },
        isInt: { errorMessage: ORGANIZATION_MESSAGES.ORG_ID_INVALID },
        custom: {
          options: async (value, { req }) => {
            const organization = await organizationsServices.getOrganizationById(value)
            if (!organization) {
              throw new AppError(ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
const createCampaignValidator = validate(
  checkSchema(
    {
      categoryId: {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.CATEGORY_ID_REQUIRED },
        isInt: {
          errorMessage: CAMPAIGN_MESSAGES.CATEGORY_ID_MUST_BE_INT
        },
        toInt: true
      },
      title: {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.TITLE_REQUIRED },
        isString: { errorMessage: CAMPAIGN_MESSAGES.TITLE_MUST_BE_STRING },
        trim: true
      },
      description: {
        optional: true,
        isString: { errorMessage: CAMPAIGN_MESSAGES.DESCRIPTION_MUST_BE_STRING },
        trim: true
      },
      startDate: {
        optional: true,
        isISO8601: { errorMessage: CAMPAIGN_MESSAGES.START_DATE_INVALID }
      },
      endDate: {
        optional: true,
        isISO8601: { errorMessage: CAMPAIGN_MESSAGES.END_DATE_INVALID },
        custom: {
          options: (value, { req }) => {
            const startDate = req.body.startDate ? parseISO(req.body.startDate) : new Date()
            const endDate = parseISO(value)
            if (isBefore(endDate, startDate)) {
              throw new AppError(CAMPAIGN_MESSAGES.END_DATE_MUST_BE_AFTER_START_DATE, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      },
      targetAmount: {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.TARGET_AMOUNT_REQUIRED },
        isDecimal: { errorMessage: CAMPAIGN_MESSAGES.TARGET_AMOUNT_MUST_BE_NUMBER }
      },
      media: {
        optional: true,
        isArray: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_MUST_BE_ARRAY }
      },
      'media.*.url': {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_URL_REQUIRED }
      },
      'media.*.mediaTypeId': {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_TYPE_ID_REQUIRED },
        isInt: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_TYPE_ID_MUST_BE_INT }
      }
    },
    ['body']
  )
)

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

const getCampaignsValidator = validate(
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
          options: [['title', 'startDate', 'createdAt', 'targetAmount', 'currentAmount']],
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
          options: [Object.values(campaignStatus)],
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

const updateCampaignValidator = validate(
  checkSchema(
    {
      categoryId: {
        optional: true,
        isInt: {
          errorMessage: CAMPAIGN_MESSAGES.CATEGORY_ID_MUST_BE_INT
        },
        toInt: true
      },
      title: {
        optional: true,
        isString: { errorMessage: CAMPAIGN_MESSAGES.TITLE_MUST_BE_STRING },
        trim: true
      },
      description: {
        optional: true,
        isString: { errorMessage: CAMPAIGN_MESSAGES.DESCRIPTION_MUST_BE_STRING },
        trim: true
      },
      startDate: {
        optional: true,
        isISO8601: { errorMessage: CAMPAIGN_MESSAGES.START_DATE_INVALID }
      },
      endDate: {
        optional: true,
        isISO8601: { errorMessage: CAMPAIGN_MESSAGES.END_DATE_INVALID },
        custom: {
          options: (value, { req }) => {
            const startDate = req.body.startDate ? parseISO(req.body.startDate) : new Date()
            const endDate = parseISO(value)
            if (isBefore(endDate, startDate)) {
              throw new AppError(CAMPAIGN_MESSAGES.END_DATE_MUST_BE_AFTER_START_DATE, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      },
      targetAmount: {
        optional: true,
        isDecimal: { errorMessage: CAMPAIGN_MESSAGES.TARGET_AMOUNT_MUST_BE_NUMBER }
      },
      statusId: {
        optional: true,
        isIn: {
          options: [Object.values(campaignStatus)],
          errorMessage: CAMPAIGN_MESSAGES.STATUS_ID_INVALID
        },
        isInt: { errorMessage: CAMPAIGN_MESSAGES.STATUS_ID_INVALID }
      },
      media: {
        optional: true,
        isArray: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_MUST_BE_ARRAY }
      },
      'media.*.url': {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_URL_REQUIRED }
      },
      'media.*.mediaTypeId': {
        notEmpty: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_TYPE_ID_REQUIRED },
        isInt: { errorMessage: CAMPAIGN_MESSAGES.MEDIA_TYPE_ID_MUST_BE_INT }
      }
    },
    ['body']
  )
)
module.exports = {
  orgIdValidator,
  createCampaignValidator,
  updateCampaignValidator,
  campaignIdValidator,
  getCampaignsValidator
}
