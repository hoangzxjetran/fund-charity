const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { COMMON, VOLUNTEER_MESSAGES } = require('../constants/message')
const { convertStringObjToNumberObj } = require('../utils/common')
const { AppError } = require('../controllers/error.controllers')
const { volunteerStatus } = require('../constants/enum')

const getVolunteersInCampaignValidator = validate(
  checkSchema({
    campaignId: {
      in: ['params'],
      notEmpty: {
        errorMessage: VOLUNTEER_MESSAGES.CAMPAIGN_ID_REQUIRED
      },
      isInt: {
        errorMessage: VOLUNTEER_MESSAGES.CAMPAIGN_ID_INVALID
      },
      // toInt: true
    },
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
        options: [['createdAt', 'updatedAt']],
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
    search: {
      optional: true,
      trim: true
    },
    status: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          const allowedStatuses = convertStringObjToNumberObj(volunteerStatus)
          if (!allowedStatuses[value]) {
            throw new AppError(VOLUNTEER_MESSAGES.STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          return true
        }
      }
    }
  })
)

const registerCampaignValidator = validate(
  checkSchema({
    campaignId: {
      in: ['params'],
      notEmpty: {
        errorMessage: VOLUNTEER_MESSAGES.CAMPAIGN_ID_REQUIRED
      },
      isInt: {
        errorMessage: VOLUNTEER_MESSAGES.CAMPAIGN_ID_INVALID
      },
      toInt: true
    },
    registrationDate: {
      in: ['body'],
      notEmpty: {
        errorMessage: VOLUNTEER_MESSAGES.REGISTER_DATE_REQUIRED
      },
      isISO8601: {
        options: {
          strictSeparator: true,
          strict: true
        },
        errorMessage: VOLUNTEER_MESSAGES.REGISTER_DATE_INVALID
      }
    }
  })
)

const updateStatusValidator = validate(
  checkSchema({
    registrationId: {
      notEmpty: {
        errorMessage: VOLUNTEER_MESSAGES.REGISTRATION_ID_REQUIRED
      },
      isInt: {
        errorMessage: VOLUNTEER_MESSAGES.REGISTRATION_ID_INVALID
      }
    },
    status: {
      notEmpty: {
        errorMessage: VOLUNTEER_MESSAGES.STATUS_REQUIRED
      },
      custom: {
        options: (value, { req }) => {
          const allowedStatuses = convertStringObjToNumberObj(volunteerStatus)
          if (!allowedStatuses[value]) {
            throw new AppError(VOLUNTEER_MESSAGES.STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          return true
        }
      }
    }
  })
)

module.exports = {
  getVolunteersInCampaignValidator,
  registerCampaignValidator,
  updateStatusValidator
}
