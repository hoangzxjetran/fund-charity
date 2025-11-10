const express = require('express')
const router = express.Router()
const FundsControllers = require('../controllers/funds.controllers.js')
const {
  createFundValidator,
  uploadBannerFundValidator,
  getFundsValidator
} = require('../validations/fund-validations.js')
const {
  uploadBannerFund,
  resizeBannerFund,
  uploadMediaFund,
  resizeImagesFund
} = require('../middlewares/uploadFile.middlewares.js')
const { isAuthorized } = require('../middlewares/auth.middewares.js')

router
  .route('/')
  .post(isAuthorized, createFundValidator, FundsControllers.createFund)
  .get(getFundsValidator, FundsControllers.getFunds)
router
  .route('/upload-banner')
  .post(isAuthorized, uploadBannerFundValidator, uploadBannerFund, resizeBannerFund, FundsControllers.uploadBannerFund)
router.route('/upload-media').post(uploadMediaFund, resizeImagesFund, FundsControllers.uploadMediaFund)
module.exports = router
