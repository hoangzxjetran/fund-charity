const express = require('express')
const router = express.Router()
const VolunteersControllers = require('../controllers/volunteers.controllers.js')
const {
  registerCampaignValidator,
  getVolunteersInCampaignValidator
} = require('../validations/volunteers.validations.js')
const { isAuthorized } = require('../middlewares/auth.middewares.js')

router
  .route('/:campaignId')
  .get(getVolunteersInCampaignValidator, VolunteersControllers.getVolunteers)
  .post(isAuthorized, registerCampaignValidator, VolunteersControllers.registerCampaign)

module.exports = router
