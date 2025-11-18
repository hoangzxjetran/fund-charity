const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { PAYMENT_MESSAGES } = require('../constants/message')

const createPaymentValidator = validate(
  checkSchema(
    {
      campaignId: {
        notEmpty: {
          errorMessage: PAYMENT_MESSAGES.CAMPAIGN_ID_REQUIRED
        },
        isInt: {
          errorMessage: PAYMENT_MESSAGES.CAMPAIGN_ID_INVALID
        },
        toInt: true
      },
      amount: {
        notEmpty: {
          errorMessage: PAYMENT_MESSAGES.AMOUNT_REQUIRED
        },
        isInt: {
          options: { min: 1000 },
          errorMessage: PAYMENT_MESSAGES.AMOUNT_MINIMUM
        },
        toInt: true
      },
      isAnonymous: {
        optional: true,
        isBoolean: {
          errorMessage: PAYMENT_MESSAGES.ANONYMOUS_MUST_BE_BOOLEAN
        },
        toBoolean: true
      },
      email: {
        optional: true,
        isEmail: {
          errorMessage: PAYMENT_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        normalizeEmail: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: PAYMENT_MESSAGES.ADDRESS_INVALID
        },
        trim: true
      },
      phoneNumber: {
        optional: true,
        trim: true
      },
      message: {
        optional: true,
        isString: {
          errorMessage: PAYMENT_MESSAGES.MESSAGE_INVALID
        },
        trim: true
      }
    },
    ['body']
  )
)

module.exports = {
  createPaymentValidator
}
