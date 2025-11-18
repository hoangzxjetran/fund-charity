const { Router } = require('express')
const { campaignIdValidator, getDonationsValidator } = require('../validations/donations.validations.js')
const donationsControllers = require('../controllers/donations.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const donationRouter = Router()

donationRouter.get(
  '/:campaignId',
  campaignIdValidator,
  getDonationsValidator,
  catchAsync(donationsControllers.getDonations)
)
module.exports = donationRouter
