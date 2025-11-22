const { Router } = require('express')
const WalletControllers = require('../controllers/wallets.controllers')
const walletRouter = Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const { getWalletsValidator, getWalletByUserIdValidator } = require('../validations/wallets.validations.js')

walletRouter.route('/').get(isAuthorized, getWalletsValidator, catchAsync(WalletControllers.getAll))
walletRouter
  .route('/:userId')
  .get(isAuthorized, getWalletByUserIdValidator, catchAsync(WalletControllers.getWalletByUserId))

module.exports = walletRouter
