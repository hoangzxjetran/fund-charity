const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { FUND_MESSAGES, COMMON } = require('../constants/message')
const { fundraisingMethod, mediaType } = require('../constants/enum')
const { convertStringObjToNumberObj } = require('../utils/common')
const HTTP_STATUS = require('../constants/httpStatus')

const uploadBannerFundValidator = validate(
  checkSchema(
    {
      file: {
        custom: {
          options: (value, { req }) => {
            if (!req.file) {
              throw new AppError(FUND_MESSAGES.BANNER_URL_REQUIRED, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

const createFundValidator = validate(
  checkSchema({
    methodId: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.METHOD_ID_REQUIRED
      },
      toInt: true,
      isInt: {
        options: { min: 1 },
        errorMessage: FUND_MESSAGES.METHOD_ID_INVALID
      },
      custom: {
        options: (value) => {
          const fundraisingMethodName = convertStringObjToNumberObj(fundraisingMethod)
          if (!fundraisingMethodName[value]) {
            throw new Error(FUND_MESSAGES.METHOD_ID_INVALID)
          }
          return true
        }
      }
    },
    milestones: {
      optional: true,
      isArray: {
        errorMessage: FUND_MESSAGES.MILESTONE_IS_ARRAY
      },
      custom: {
        options: (value, { req }) => {
          if (req.body.methodId === fundraisingMethod.Milestone) {
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error(FUND_MESSAGES.MILESTONE_REQUIRED)
            }

            for (const milestone of value) {
              if (milestone === null || typeof milestone !== 'object') {
                throw new Error(FUND_MESSAGES.MILESTONE_ITEM_INVALID)
              }

              const fields = [
                'title',
                'description',
                'targetAmount',
                'achievedAmount',
                'startDate',
                'endDate',
                'orderIndex'
              ]
              for (const field of fields) {
                if (!(field in milestone)) {
                  throw new Error(FUND_MESSAGES.MILESTONE_ITEM_INVALID)
                }
              }
              if (milestone.endDate < milestone.startDate) {
                throw new Error(FUND_MESSAGES.MILESTONE_DUE_DATE_INVALID)
              }
            }
          }
          return true
        }
      }
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
          if (req.body.startDate && value < req.body.startDate) {
            throw new AppError(FUND_MESSAGES.END_DATE_BEFORE_START_DATE)
          }
          return true
        }
      }
    },
    fundName: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.FUND_NAME_NOT_EMPTY
      },
      isString: {
        errorMessage: FUND_MESSAGES.FUND_NAME_MUST_BE_STRING
      },
      trim: true
    },
    bannerUrl: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.BANNER_URL_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.BANNER_URL_INVALID
      }
    },
    description: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.DESCRIPTION_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.DESCRIPTION_MUST_BE_STRING
      },
      trim: true
    },
    bankAccountNumber: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.BANK_ACCOUNT_NUMBER_IS_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.BANK_ACCOUNT_NUMBER_MUST_BE_STRING
      },
      trim: true
    },
    bankName: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.BANK_NAME_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.BANK_NAME_MUST_BE_STRING
      },
      trim: true
    },
    bankBranch: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.BANK_BRANCH_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.BANK_BRANCH_MUST_BE_STRING
      },
      trim: true
    },
    purpose: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.PURPOSE_REQUIRED
      },
      isString: {
        errorMessage: FUND_MESSAGES.PURPOSE_MUST_BE_STRING
      },
      trim: true
    },
    urlQrCode: {
      optional: true,
      isString: {
        errorMessage: FUND_MESSAGES.URL_QR_CODE_INVALID
      },
      trim: true
    },
    targetAmount: {
      optional: true,
      isFloat: {
        options: { min: 0 },
        errorMessage: FUND_MESSAGES.AMOUNT_MINIMUM
      },
      toFloat: true
    },
    categoryFund: {
      notEmpty: {
        errorMessage: FUND_MESSAGES.CATEGORY_ID_REQUIRED
      },
      isInt: {
        options: { min: 1 },
        errorMessage: FUND_MESSAGES.CATEGORY_ID_MUST_BE_INTEGER
      },
      toInt: true
    },
    mediaFund: {
      optional: true,
      isArray: {
        errorMessage: FUND_MESSAGES.MEDIA_FUND_INVALID
      },
      custom: {
        options: (value) => {
          const MAX_FILE = 10
          const MIN_FILE = 1
          if (value.length > MAX_FILE) {
            throw new AppError(FUND_MESSAGES.MEDIA_FUND_ITEM_MAX, HTTP_STATUS.BAD_REQUEST)
          }
          if (value.length < MIN_FILE) {
            throw new AppError(FUND_MESSAGES.MEDIA_FUND_ITEM_MIN, HTTP_STATUS.BAD_REQUEST)
          }
          const type = convertStringObjToNumberObj(mediaType)
          for (const item of value) {
            if (!type[item.mediaType] || !item.url) {
              throw new AppError(COMMON.MEDIA_ITEM_INVALID, HTTP_STATUS.BAD_REQUEST)
            }
          }
          return true
        }
      }
    }
  })
)

module.exports = {
  createFundValidator,
  uploadBannerFundValidator
}
