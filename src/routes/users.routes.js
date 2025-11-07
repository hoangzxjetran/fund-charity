const { Router } = require('express')
const UserControllers = require('../controllers/user.controllers.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const { signUpValidator } = require('../validations/user.validations.js')
const router = Router()

router.route('/sign-up').post(signUpValidator, catchAsync(UserControllers.signUp))
module.exports = router
