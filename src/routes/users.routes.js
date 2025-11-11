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
  getUsersValidator,
  updateUserValidator,
  userIdValidator,
  uploadAvatarValidator
} = require('../validations/user.validations.js')
const { isAuthorized, isAdmin } = require('../middlewares/auth.middewares.js')
const { resizeAvatar, uploadAvatar } = require('../middlewares/uploadFile.middlewares.js')
const router = Router()
router.route('/').get(getUsersValidator, isAuthorized, isAdmin, catchAsync(UserControllers.getUsers))
router
  .route('/my-profile')
  .get(isAuthorized, catchAsync(UserControllers.getProfile))
  .put(isAuthorized, updateProfileValidator, catchAsync(UserControllers.updateProfile))

router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
router.route('/sign-in').post(signInValidator, catchAsync(UserControllers.signIn))
router.route('/forgot-password').post(forgotPasswordValidator, catchAsync(UserControllers.forgotPassword))
router
  .route('/verify-password-token')
  .post(verifyPasswordTokenValidator, catchAsync(UserControllers.verifyPasswordToken))
router.route('/reset-password').post(resetPasswordValidator, catchAsync(UserControllers.resetPassword))

router.route('/change-password').put(isAuthorized, changePasswordValidator, catchAsync(UserControllers.changePassword))
router.route('/refresh-token').post(isAuthorized, catchAsync(UserControllers.refreshToken))

router
  .route('/upload-avatar')
  .post(isAuthorized, uploadAvatarValidator, uploadAvatar, resizeAvatar, catchAsync(UserControllers.uploadAvatarUser))
router
  .route('/:userId')
  .get(userIdValidator, isAuthorized, isAdmin, catchAsync(UserControllers.getUser))
  .put(updateProfileValidator, isAuthorized, isAdmin, catchAsync(UserControllers.updateUser))
  .delete(userIdValidator, isAuthorized, isAdmin, catchAsync(UserControllers.deleteUser))

module.exports = router
