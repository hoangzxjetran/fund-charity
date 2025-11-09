const { checkSchema } = require('express-validator')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { USER_MESSAGES, COMMON, FUND_CATEGORY_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const validate = require('../utils/validate.js')
const fundCategoriesServices = require('../services/fund-categories.services.js')

const getFundCategoriesValidator = validate(
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
      }
    },
    ['query']
  )
)

const createFundCategoryValidator = validate(
  checkSchema({
    categoryName: {
      in: ['body'],
      isString: {
        errorMessage: FUND_CATEGORY_MESSAGES.CATEGORY_NAME_MUST_BE_STRING
      },
      trim: true,
      notEmpty: {
        errorMessage: FUND_CATEGORY_MESSAGES.CATEGORY_NAME_NOT_EMPTY
      },
      custom: {
        options: async (value) => {
          const isExistFundCategory = await fundCategoriesServices.isExistCategoryName(value)
          if (isExistFundCategory) {
            throw new AppError(FUND_CATEGORY_MESSAGES.CATEGORY_NAME_IS_EXIST, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          return true
        }
      }
    }
  })
)

const uploadLogoIconValidator = validate(
  checkSchema({
    file: {
      custom: {
        options: (value, { req }) => {
          if (!req.file) {
            throw new AppError('Logo icon is required', HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          return true
        }
      }
    }
  })
)

module.exports = {
  getFundCategoriesValidator,
  createFundCategoryValidator,
  uploadLogoIconValidator
}
