const express = require('express')
const router = express.Router()
const CampaignsControllers = require('../controllers/campaigns.controllers')
const { resizeCampaignMedia, uploadCampaignMedia } = require('../middlewares/uploadFile.middlewares')
const {
  createCampaignValidator,
  orgIdValidator,
  campaignIdValidator,
  getCampaignsValidator,
  updateCampaignValidator
} = require('../validations/campaigns.validations')
const { isAuthorized, isAdmin } = require('../middlewares/auth.middlewares')
const catchAsync = require('../middlewares/catchAsync.middleware')

router.route('/').get(getCampaignsValidator, catchAsync(CampaignsControllers.getAll))
router.route('/uploads').post(isAuthorized, uploadCampaignMedia, resizeCampaignMedia, CampaignsControllers.uploadMedia)
router
  .route('/:orgId')
  .post(isAuthorized, orgIdValidator, createCampaignValidator, catchAsync(CampaignsControllers.createCampaign))
  .get(orgIdValidator, getCampaignsValidator, catchAsync(CampaignsControllers.getCampaigns))

router
  .route('/detail/:campaignId')
  .get(campaignIdValidator, catchAsync(CampaignsControllers.getCampaignById))
  .put(isAuthorized, campaignIdValidator, updateCampaignValidator, catchAsync(CampaignsControllers.updateCampaign))

router
  .route('/:campaignId/approved')
  .put(isAuthorized, isAdmin, campaignIdValidator, catchAsync(CampaignsControllers.approvedCampaign))

router
  .route('/:campaignId/rejected')
  .put(isAuthorized, isAdmin, campaignIdValidator, catchAsync(CampaignsControllers.rejectedCampaign))
module.exports = router
