const { Router } = require('express')
const transactionRouter = Router()

const catchAsync = require('../middlewares/catchAsync.middleware.js')
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const transactionsControllers = require('../controllers/transactions.controllers.js')
const { getTransactionsValidator } = require('../validations/transactions.validations.js')

transactionRouter
  .route('/')
  .get(isAuthorized, getTransactionsValidator, catchAsync(transactionsControllers.getTransactions))

module.exports = transactionRouter
