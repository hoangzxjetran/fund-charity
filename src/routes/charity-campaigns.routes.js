const express = require('express')
const router = express.Router()
const {
  getCharityCampaignValidator,
  charityCampaignIdValidator,
  createCampaignValidator
} = require('../validations/charity-campaigns.validations.js')
const charityCampaignsControllers = require('../controllers/charity-campaigns.controllers.js')
const { isAuthorized } = require('../middlewares/auth.middlewares.js')

router
  .route('/:fundId')
  .get(getCharityCampaignValidator, charityCampaignsControllers.getCampaigns)
  .post(createCampaignValidator, charityCampaignsControllers.createCampaign)

router
  .route('/:campaignId')
  .put(charityCampaignIdValidator, charityCampaignsControllers.updateCampaign)
  .delete(isAuthorized, charityCampaignIdValidator, charityCampaignsControllers.deleteCampaign)

module.exports = router
