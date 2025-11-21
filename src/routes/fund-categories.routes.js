const express = require('express')
const router = express.Router()
const FundCategoriesControllers = require('../controllers/fund-categories.controllers.js')
const {
  getFundCategoriesValidator,
  createFundCategoryValidator
} = require('../validations/fund-categories.validations.js')
const { uploadIconFundCategory, resizeIconFundCategory } = require('../middlewares/uploadFile.middlewares.js')
const { isAuthorized, isAdmin } = require('../middlewares/auth.middlewares.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')

router
  .route('/')
  .get(isAuthorized, getFundCategoriesValidator, catchAsync(FundCategoriesControllers.getFundCategories))
  .post(isAuthorized, isAdmin, createFundCategoryValidator, catchAsync(FundCategoriesControllers.createFundCategory))

router.post(
  '/upload-icon',
  uploadIconFundCategory,
  resizeIconFundCategory,
  catchAsync(FundCategoriesControllers.uploadLogoIcon)
)

module.exports = router
