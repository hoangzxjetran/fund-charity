const express = require('express')
const router = express.Router()
const FundCategoriesControllers = require('../controllers/fund-categories.controllers.js')
const {
  getFundCategoriesValidator,
  createFundCategoryValidator
} = require('../validations/fund-categories.validations.js')
const { uploadIconFundCategory, resizeIconFundCategory } = require('../middlewares/uploadFile.middlewares.js')
const { isAuthorized, isAdmin } = require('../middlewares/auth.middlewares.js')

router
  .route('/')
  .get(isAuthorized, getFundCategoriesValidator, FundCategoriesControllers.getFundCategories)
  .post(isAuthorized, isAdmin, createFundCategoryValidator, FundCategoriesControllers.createFundCategory)

router.post('/upload-icon', uploadIconFundCategory, resizeIconFundCategory, FundCategoriesControllers.uploadLogoIcon)

module.exports = router
