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
const { isAuthorized } = require('../middlewares/auth.middlewares')

router.route('/uploads').post(isAuthorized, uploadCampaignMedia, resizeCampaignMedia, CampaignsControllers.uploadMedia)
router
  .route('/:orgId')
  .post(isAuthorized, orgIdValidator, createCampaignValidator, CampaignsControllers.createCampaign)
  .get(orgIdValidator, getCampaignsValidator, updateCampaignValidator, CampaignsControllers.getCampaigns)

router
  .route('/detail/:campaignId')
  .get(campaignIdValidator, CampaignsControllers.getCampaignById)
  .put(isAuthorized, campaignIdValidator, updateCampaignValidator, CampaignsControllers.updateCampaign)
module.exports = router
