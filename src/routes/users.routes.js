const { Router } = require('express')
const UserControllers = require('../controllers/user.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const { signUpValidator, signInValidator } = require('../validations/user.validations.js')
const router = Router()

router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
router.route('/sign-in').post(signInValidator, catchAsync(UserControllers.signIn))

module.exports = router
