const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { FUND_MESSAGES, COMMON } = require('../constants/message')
const { fundraisingMethod, mediaType, fundStatus } = require('../constants/enum')
const { convertStringObjToNumberObj } = require('../utils/common')
const HTTP_STATUS = require('../constants/httpStatus')
const { AppError } = require('../controllers/error.controllers')
const { isBefore, parseISO } = require('date-fns')

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

const updateFundValidator = validate(
  checkSchema({
    methodId: {
      optional: true,
      toInt: true,
      isInt: {
        options: { min: 1 },
        errorMessage: FUND_MESSAGES.METHOD_ID_INVALID
      },
      custom: {
        options: (value) => {
          const fundraisingMethodName = convertStringObjToNumberObj(fundraisingMethod)
          if (!fundraisingMethodName[value]) {
            throw new AppError(FUND_MESSAGES.METHOD_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          if (value === fundraisingMethod.Milestone && !value.milestones.length) {
            throw new AppError(FUND_MESSAGES.MILESTONE_REQUIRED, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          if (value === fundraisingMethod.TimeBased && value.milestones.length) {
            throw new AppError(FUND_MESSAGES.MILESTONE_NOT_ALLOWED, HTTP_STATUS.UNPROCESSABLE_ENTITY)
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
          const start = parseISO(req.body.startDate)
          const end = parseISO(value)
          if (isBefore(end, start)) {
            throw new AppError(FUND_MESSAGES.END_DATE_BEFORE_START_DATE)
          }
          return true
        }
      }
    },
    fundName: {
      optional: true,
      isString: {
        errorMessage: FUND_MESSAGES.FUND_NAME_MUST_BE_STRING
      },
      trim: true
    },
    bannerUrl: {
      optional: true,
      isString: {
        errorMessage: FUND_MESSAGES.BANNER_URL_INVALID
      }
    },
    description: {
      optional: true,
      isString: {
        errorMessage: FUND_MESSAGES.DESCRIPTION_MUST_BE_STRING
      },
      trim: true
    },
    bankAccountNumber: {
      optional: true,

      isString: {
        errorMessage: FUND_MESSAGES.BANK_ACCOUNT_NUMBER_MUST_BE_STRING
      },
      trim: true
    },
    bankName: {
      optional: true,
      isString: {
        errorMessage: FUND_MESSAGES.BANK_NAME_MUST_BE_STRING
      },
      trim: true
    },
    bankBranch: {
      optional: true,

      isString: {
        errorMessage: FUND_MESSAGES.BANK_BRANCH_MUST_BE_STRING
      },
      trim: true
    },
    purpose: {
      optional: true,

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
      optional: true,
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

const getFundsValidator = validate(
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
      methodId: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: FUND_MESSAGES.METHOD_ID_INVALID
        },
        toInt: true,
        custom: {
          options: (value) => {
            const fundraisingMethodName = convertStringObjToNumberObj(fundraisingMethod)
            if (!fundraisingMethodName[value]) {
              throw new AppError(FUND_MESSAGES.METHOD_ID_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        toInt: true,
        isInt: {
          errorMessage: FUND_MESSAGES.STATUS_INVALID
        },
        custom: {
          options: (value) => {
            const fundStatusName = convertStringObjToNumberObj(fundStatus)
            if (!fundStatusName[value]) {
              throw new AppError(FUND_MESSAGES.STATUS_INVALID, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      },
      categoryId: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: FUND_MESSAGES.CATEGORY_ID_MUST_BE_INTEGER
        },
        toInt: true
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['startDate', 'endDate', 'targetAmount', 'currentAmount', 'createdAt']],
          errorMessage: FUND_MESSAGES.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: FUND_MESSAGES.SORT_ORDER_INVALID
        }
      },
      search: {
        optional: true,
        trim: true
      }
    },
    ['query']
  )
)

const getFundByIdValidator = validate(
  checkSchema(
    {
      fundId: {
        notEmpty: {
          errorMessage: FUND_MESSAGES.FUND_ID_REQUIRED
        },
        isInt: {
          options: { min: 1 },
          errorMessage: FUND_MESSAGES.FUND_ID_INVALID
        },
        toInt: true
      }
    },
    ['params']
  )
)

module.exports = {
  createFundValidator,
  uploadBannerFundValidator,
  updateFundValidator,
  getFundsValidator,
  getFundByIdValidator
}
