const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { COMMON, CONVERSATION_MESSAGES } = require('../constants/message')
const HTTP_STATUS = require('../constants/httpStatus')

const getMessagesValidator = validate(
  checkSchema(
    {
      conversationId: {
        notEmpty: {
          errorMessage: CONVERSATION_MESSAGES.CONVERSATION_ID_REQUIRED
        },
        isInt: {
          errorMessage: CONVERSATION_MESSAGES.CONVERSATION_ID_INVALID
        }
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
      }
    },
    ['query']
  )
)

const sendMessageValidator = validate(
  checkSchema(
    {
      conversationId: {
        notEmpty: {
          errorMessage: CONVERSATION_MESSAGES.CONVERSATION_ID_REQUIRED
        },
        isInt: {
          errorMessage: CONVERSATION_MESSAGES.CONVERSATION_ID_INVALID
        }
      },
      content: {
        optional: true,
        isString: {
          errorMessage: CONVERSATION_MESSAGES.CONTENT_INVALID
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (!value && (!req.body.media || req.body.media.length === 0)) {
              throw new Error(CONVERSATION_MESSAGES.CONTENT_OR_MEDIA_REQUIRED)
            }
            return true
          }
        }
      },
       media: {
        optional: true,
        isArray: { errorMessage: CONVERSATION_MESSAGES.MEDIA_MUST_BE_ARRAY }
      },
      'media.*.url': {
        notEmpty: { errorMessage: CONVERSATION_MESSAGES.MEDIA_URL_REQUIRED }
      },
      'media.*.mediaTypeId': {
        notEmpty: { errorMessage: CONVERSATION_MESSAGES.MEDIA_TYPE_ID_REQUIRED },
        isInt: { errorMessage: CONVERSATION_MESSAGES.MEDIA_TYPE_ID_MUST_BE_INT }
      }
    },
    ['body']
  )
)
module.exports = {
  getMessagesValidator,
  sendMessageValidator
}
