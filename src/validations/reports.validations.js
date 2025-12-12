const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { REPORT_MESSAGES, COMMON } = require('../constants/message')
const HTTP_STATUS = require('../constants/httpStatus')

const createReportValidator = validate(
  checkSchema(
    {
      targetId: {
        notEmpty: REPORT_MESSAGES.TARGET_ID_IS_REQUIRED,
        isInt: REPORT_MESSAGES.TARGET_ID_MUST_BE_INTEGER
      },
      reasonId: {
        notEmpty: REPORT_MESSAGES.REASON_ID_IS_REQUIRED,
        isInt: REPORT_MESSAGES.REASON_ID_MUST_BE_INTEGER
      },
      description: {
        optional: true,
        isString: REPORT_MESSAGES.DESCRIPTION_MUST_BE_STRING
      }
    },
    ['body']
  )
)

const getAllReportsValidator = validate(
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
          options: [['campaign', 'createdAt', 'updatedAt']],
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
            const allowedStatuses = ['pending', 'reviewed', 'rejected']
            if (!allowedStatuses.includes(value)) {
              throw new AppError(REPORT_MESSAGES.STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      campaignId: {
        optional: true,
        isInt: {
          errorMessage: REPORT_MESSAGES.CAMPAIGN_ID_MUST_BE_INTEGER
        },
        toInt: true
      }
    },
    ['query']
  )
)

const updateStatusReportValidator = validate(
  checkSchema(
    {
      status: {
        custom: {
          options: (value, { req }) => {
            const allowedStatuses = ['pending', 'reviewed', 'rejected']
            if (!allowedStatuses.includes(value)) {
              throw new AppError(REPORT_MESSAGES.STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

module.exports = {
  createReportValidator,
  getAllReportsValidator,
  updateStatusReportValidator
}
