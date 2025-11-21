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
  .get(getFundsValidator, catchAsync(FundsControllers.getFunds))

router
  .route('/:fundId')
  .get(getFundByIdValidator, catchAsync(FundsControllers.getFundById))
  .put(isAuthorized, updateFundValidator, catchAsync(FundsControllers.updateFund))
router
  .route('/upload-banner')
  .post(
    isAuthorized,
    uploadBannerFundValidator,
    uploadBannerFund,
    resizeBannerFund,
    catchAsync(FundsControllers.uploadBannerFund)
  )
router.route('/upload-media').post(uploadMediaFund, resizeImagesFund, catchAsync(FundsControllers.uploadMediaFund))
module.exports = router
