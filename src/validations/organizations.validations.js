const { checkSchema } = require('express-validator')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { COMMON, ORGANIZATION_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const validate = require('../utils/validate.js')

const getOrganizationsValidator = validate(
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
        trim: true
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['orgName', 'createdAt']],
          errorMessage: COMMON.SORT_BY_INVALID
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ASC', 'DESC']],
          errorMessage: COMMON.SORT_ORDER_INVALID
        }
      }
    },
    ['query']
  )
)

const createOrganizationValidator = validate(
  checkSchema(
    {
      orgName: {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.ORG_NAME_REQUIRED
        },
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ORG_NAME_MUST_BE_STRING
        },
        trim: true
      },
      email: {
        optional: true,
        isEmail: {
          errorMessage: ORGANIZATION_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        normalizeEmail: true
      },
      phoneNumber: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.PHONE_NUMBER_MUST_BE_STRING
        },
        trim: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ADDRESS_MUST_BE_STRING
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      },
      website: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.WEBSITE_MUST_BE_STRING
        },
        isURL: {
          errorMessage: ORGANIZATION_MESSAGES.WEBSITE_INVALID
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.AVATAR_MUST_BE_STRING
        },
        trim: true
      },
      banks: {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.BANK_IS_REQUIRED
        },
        isArray: {
          errorMessage: ORGANIZATION_MESSAGES.BANKS_MUST_BE_ARRAY
        }
      },
      'banks.*.bankName': {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.BANK_NAME_REQUIRED
        },
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.BANK_NAME_MUST_BE_STRING
        },
        trim: true
      },
      'banks.*.accountNumber': {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.ACCOUNT_NUMBER_REQUIRED
        },
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ACCOUNT_NUMBER_MUST_BE_STRING
        },
        trim: true
      },
      'banks.*.accountHolder': {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.ACCOUNT_HOLDER_REQUIRED
        },
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ACCOUNT_HOLDER_MUST_BE_STRING
        },
        trim: true
      },
      'banks.*.branch': {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.BRANCH_REQUIRED
        },
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.BRANCH_MUST_BE_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)

const organizationIdValidator = validate(
  checkSchema(
    {
      orgId: {
        notEmpty: {
          errorMessage: ORGANIZATION_MESSAGES.ORG_ID_REQUIRED
        },
        isInt: {
          options: { min: 1 },
          errorMessage: ORGANIZATION_MESSAGES.ORG_ID_INVALID
        },
        toInt: true
      }
    },
    ['params']
  )
)

const updateOrganizationValidator = validate(
  checkSchema(
    {
      orgName: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ORG_NAME_MUST_BE_STRING
        },
        trim: true
      },
      email: {
        optional: true,
        isEmail: {
          errorMessage: ORGANIZATION_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        normalizeEmail: true
      },
      phoneNumber: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.PHONE_NUMBER_MUST_BE_STRING
        },
        trim: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.ADDRESS_MUST_BE_STRING
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.DESCRIPTION_MUST_BE_STRING
        },
        trim: true
      },
      website: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.WEBSITE_MUST_BE_STRING
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: ORGANIZATION_MESSAGES.AVATAR_MUST_BE_STRING
        },
        trim: true
      },
      media: {
        optional: true,
        isArray: {
          errorMessage: ORGANIZATION_MESSAGES.MEDIA_MUST_BE_ARRAY
        },
        custom: {
          options: (value) => {
            const maxItems = 5
            if (value.length > maxItems) {
              throw new AppError(
                ORGANIZATION_MESSAGES.MEDIA_MAX_ITEMS.replace('{max}', maxItems),
                HTTP_STATUS.UNPROCESSABLE_ENTITY
              )
            }
            return true
          }
        }
      },
      banks: {
        optional: true,
        isArray: {
          errorMessage: ORGANIZATION_MESSAGES.BANKS_MUST_BE_ARRAY
        }
      },
      'banks.*.bankName': {
        optional: true,
        isString: true,
        trim: true
      },
      'banks.*.bankAccount': {
        optional: true,
        isString: true,
        trim: true
      },
      'banks.*.branch': {
        optional: true,
        isString: true,
        trim: true
      },
      'banks.*.accountHolder': {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

module.exports = {
  getOrganizationsValidator,
  createOrganizationValidator,
  organizationIdValidator,
  updateOrganizationValidator
}
