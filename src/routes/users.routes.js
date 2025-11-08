const { Router } = require('express')
const UserControllers = require('../controllers/user.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const { signUpValidator, signInValidator, forgotPasswordValidator } = require('../validations/user.validations.js')
const router = Router()

router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
router.route('/sign-in').post(signInValidator, catchAsync(UserControllers.signIn))
router.route('/forgot-password').post(forgotPasswordValidator, catchAsync(UserControllers.forgotPassword))

module.exports = router
