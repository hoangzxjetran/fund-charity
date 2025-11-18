const { Router } = require('express')
const PaymentsControllers = require('../controllers/payments.controllers')
const { createPaymentValidator } = require('../validations/payments.validations')
const catchAsync = require('../middlewares/catchAsync.middleware')

const paymentRouter = Router()

paymentRouter.get('/create', createPaymentValidator, catchAsync(PaymentsControllers.createPayment))
paymentRouter.get('/check', catchAsync(PaymentsControllers.checkPayment))
module.exports = paymentRouter
