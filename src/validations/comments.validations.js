const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { COMMENT_MESSAGES, COMMON, CAMPAIGN_MESSAGES } = require('../constants/message')
const createCommentValidator = validate(
  checkSchema(
    {
      campaignId: {
        isInt: {
          errorMessage: COMMENT_MESSAGES.CAMPAIGN_ID_MUST_BE_INTEGER
        },
        notEmpty: {
          errorMessage: COMMENT_MESSAGES.CAMPAIGN_ID_IS_REQUIRED
        }
      },
      content: {
        isString: {
          errorMessage: COMMENT_MESSAGES.CONTENT_MUST_BE_STRING
        },
        notEmpty: {
          errorMessage: COMMENT_MESSAGES.CONTENT_IS_REQUIRED
        }
      },
      media: {
        optional: true,
        isArray: { errorMessage: COMMON.MEDIA_MUST_BE_ARRAY }
      },
      'media.*.url': {
        notEmpty: { errorMessage: COMMON.MEDIA_URL_REQUIRED }
      },
      'media.*.mediaTypeId': {
        notEmpty: { errorMessage: COMMON.MEDIA_TYPE_ID_REQUIRED },
        isInt: { errorMessage: COMMON.MEDIA_TYPE_ID_MUST_BE_INT }
      }
    },
    ['body']
  )
)

const commentIdValidator = validate(
  checkSchema(
    {
      commentId: {
        isInt: {
          errorMessage: COMMENT_MESSAGES.COMMENT_ID_MUST_BE_INTEGER
        },
        notEmpty: {
          errorMessage: COMMENT_MESSAGES.COMMENT_ID_IS_REQUIRED
        }
      }
    },
    ['params']
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
const getCommentsByCampaignIdValidator = validate(
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
          options: [['createdAt']],
          errorMessage: COMMON.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: CAMPAIGN_MESSAGES.SORT_ORDER_INVALID
        }
      }
    },
    ['query']
  )
)

module.exports = {
  createCommentValidator,
  commentIdValidator,
  getCommentsByCampaignIdValidator,
  campaignIdValidator
}
