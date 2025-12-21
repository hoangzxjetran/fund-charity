const { Router } = require('express')
const statisticsControllers = require('../controllers/statistics.controllers')
const catchAsync = require('../middlewares/catchAsync.middleware')
const { isAuthorized } = require('../middlewares/auth.middlewares')

const router = Router()

router.get('/overview', isAuthorized, catchAsync(statisticsControllers.getStatistics))
router.get('/donations-by-month', isAuthorized, catchAsync(statisticsControllers.getDonationByMonth))

module.exports = router
