const { Router } = require('express')
const UserControllers = require('../controllers/user.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const {
  signUpValidator,
  signInValidator,
  forgotPasswordValidator,
  verifyPasswordTokenValidator,
  resetPasswordValidator
} = require('../validations/user.validations.js')
const router = Router()

router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
router.route('/sign-in').post(signInValidator, catchAsync(UserControllers.signIn))
router.route('/forgot-password').post(forgotPasswordValidator, catchAsync(UserControllers.forgotPassword))
router
  .route('/verify-password-token')
  .post(verifyPasswordTokenValidator, catchAsync(UserControllers.verifyPasswordToken))
router.route('/reset-password').post(resetPasswordValidator, catchAsync(UserControllers.resetPassword))

module.exports = router
