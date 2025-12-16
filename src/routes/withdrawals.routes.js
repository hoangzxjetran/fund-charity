const { Router } = require('express')

const catchAsync = require('../middlewares/catchAsync.middleware')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const {
  createWithdrawalValidator,
  getAllWithdrawalsValidator,
  updateWithdrawalStatusValidator
} = require('../validations/withdrawals.validations')
const withdrawalsControllers = require('../controllers/withdrawals.controllers')

const withdrawalRouter = Router()

withdrawalRouter
  .route('/')
  .post(isAuthorized, createWithdrawalValidator, catchAsync(withdrawalsControllers.create))
  .get(isAuthorized, getAllWithdrawalsValidator, catchAsync(withdrawalsControllers.getAll))

withdrawalRouter
  .route('/:withdrawalId')
  .post(isAuthorized, updateWithdrawalStatusValidator, catchAsync(withdrawalsControllers.updateStatus))

module.exports = withdrawalRouter
