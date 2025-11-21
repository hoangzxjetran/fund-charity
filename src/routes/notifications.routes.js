const { Router } = require('express')
const NotificationControllers = require('../controllers/notification.controllers')
const notificationRouter = Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const { getNotificationsValidator } = require('../validations/notifications.validations.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')

notificationRouter.get(
  '/',
  isAuthorized,
  getNotificationsValidator,
  catchAsync(NotificationControllers.getNotifications)
)

module.exports = notificationRouter
