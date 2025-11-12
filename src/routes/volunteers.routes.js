const express = require('express')
const router = express.Router()
const VolunteersControllers = require('../controllers/volunteers.controllers.js')
const {
  registerCampaignValidator,
  getVolunteersInCampaignValidator,
  updateStatusValidator
} = require('../validations/volunteers.validations.js')
const { isAuthorized } = require('../middlewares/auth.middewares.js')

router
  .route('/:campaignId')
  .get(getVolunteersInCampaignValidator, VolunteersControllers.getVolunteers)
  .post(isAuthorized, registerCampaignValidator, VolunteersControllers.registerCampaign)
router.route('/status/:registrationId')
  .put(isAuthorized, updateStatusValidator, VolunteersControllers.updateStatus)

module.exports = router
