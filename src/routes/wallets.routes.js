const { Router } = require('express')
const WalletControllers = require('../controllers/wallets.controllers')
const walletRouter = Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')

walletRouter.route('/').get(isAuthorized, catchAsync(WalletControllers.getAll))
walletRouter.route('/:userId').get(isAuthorized, catchAsync(WalletControllers.getWalletByUserId))

module.exports = walletRouter
