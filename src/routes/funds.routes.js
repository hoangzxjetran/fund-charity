const express = require('express')
const router = express.Router()
const FundsControllers = require('../controllers/funds.controllers.js')
const {
  createFundValidator,
  uploadBannerFundValidator,
  getFundsValidator,
  getFundByIdValidator,
  updateFundValidator
} = require('../validations/fund-validations.js')
const {
  uploadBannerFund,
  resizeBannerFund,
  uploadMediaFund,
  resizeImagesFund
} = require('../middlewares/uploadFile.middlewares.js')
const { isAuthorized } = require('../middlewares/auth.middlewares.js')

router
  .route('/')
  .post(isAuthorized, createFundValidator, FundsControllers.createFund)
  .get(getFundsValidator, FundsControllers.getFunds)

router
  .route('/:fundId')
  .get(getFundByIdValidator, FundsControllers.getFundById)
  .put(isAuthorized, updateFundValidator, FundsControllers.updateFund)
router
  .route('/upload-banner')
  .post(isAuthorized, uploadBannerFundValidator, uploadBannerFund, resizeBannerFund, FundsControllers.uploadBannerFund)
router.route('/upload-media').post(uploadMediaFund, resizeImagesFund, FundsControllers.uploadMediaFund)
module.exports = router
