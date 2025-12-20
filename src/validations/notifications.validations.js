const { checkSchema } = require('express-validator')
const { COMMON, NOTIFICATION_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const validate = require('../utils/validate')
const HTTP_STATUS = require('../constants/httpStatus')

const getNotificationsValidator = validate(
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
      }
    },
    ['query']
  )
)

const updateNotificationValidator = validate(
  checkSchema({
    notificationId: {
      in: ['params'],
      exists: {
        errorMessage: NOTIFICATION_MESSAGES.NOTIFICATION_ID_REQUIRED
      },
      isInt: {
        options: { min: 1 },
        errorMessage: NOTIFICATION_MESSAGES.NOTIFICATION_ID_INVALID
      },
      toInt: true
    },
    isRead: {
      in: ['body'],
      exists: {
        errorMessage: NOTIFICATION_MESSAGES.IS_READ_REQUIRED
      },
      isBoolean: {
        errorMessage: NOTIFICATION_MESSAGES.IS_READ_INVALID
      },
      toBoolean: true
    }
  })
)

const markAsReadValidator = validate(
  checkSchema({
    notificationId: {
      in: ['params'],
      exists: {
        errorMessage: NOTIFICATION_MESSAGES.NOTIFICATION_ID_REQUIRED
      },
      isInt: {
        options: { min: 1 },
        errorMessage: NOTIFICATION_MESSAGES.NOTIFICATION_ID_INVALID
      },
      toInt: true
    }
  })
)
module.exports = {
  getNotificationsValidator,
  updateNotificationValidator,
  markAsReadValidator
}
