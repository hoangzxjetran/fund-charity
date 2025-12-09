const express = require('express')
const router = express.Router()
const { getFundsValidator } = require('../validations/fund-validations.js')
const reasonsControllers = require('../controllers/reasons.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')

router.route('/').get(getFundsValidator, catchAsync(reasonsControllers.getAll))
module.exports = router
