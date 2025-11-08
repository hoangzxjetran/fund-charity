const { Router } = require('express')
const UserControllers = require('../controllers/user.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const {
  signUpValidator,
  signInValidator,
  forgotPasswordValidator,
  verifyPasswordTokenValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
  getUsersValidator
} = require('../validations/user.validations.js')
const { isAuthorized, isAdmin } = require('../middlewares/auth.middewares.js')
const router = Router()
router.route('/').get(getUsersValidator, isAdmin, catchAsync(UserControllers.getUsers))
router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
router.route('/sign-in').post(signInValidator, catchAsync(UserControllers.signIn))
router.route('/forgot-password').post(forgotPasswordValidator, catchAsync(UserControllers.forgotPassword))
router
  .route('/verify-password-token')
  .post(verifyPasswordTokenValidator, catchAsync(UserControllers.verifyPasswordToken))
router.route('/reset-password').post(resetPasswordValidator, catchAsync(UserControllers.resetPassword))

router
  .route('/my-profile')
  .get(isAuthorized, catchAsync(UserControllers.getProfile))
  .put(isAuthorized, updateProfileValidator, catchAsync(UserControllers.updateProfile))

router.route('/change-password').post(isAuthorized, changePasswordValidator, catchAsync(UserControllers.changePassword))
router.route('/refresh-token').post(isAuthorized, catchAsync(UserControllers.refreshToken))

module.exports = router
