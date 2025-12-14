const { Router } = require('express')
const {
  campaignIdValidator,
  getDonationsValidator,
  getTop5DonationsValidator,
  getTop5DonationsByCampaignValidator
} = require('../validations/donations.validations.js')
const donationsControllers = require('../controllers/donations.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const donationRouter = Router()

donationRouter.get('/top-5', getTop5DonationsValidator, catchAsync(donationsControllers.getTop5Donations))
donationRouter.get(
  '/top-5/:campaignId',
  getTop5DonationsByCampaignValidator,
  catchAsync(donationsControllers.getTop5DonationsByCampaign)
)
donationRouter.get(
  '/:campaignId',
  campaignIdValidator,
  getDonationsValidator,
  catchAsync(donationsControllers.getDonations)
)
module.exports = donationRouter
