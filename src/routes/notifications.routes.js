const { Router } = require('express')
const NotificationControllers = require('../controllers/notification.controllers')
const notificationRouter = Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const {
  getNotificationsValidator,
  updateNotificationValidator
} = require('../validations/notifications.validations.js')
const catchAsync = require('../middlewares/catchAsync.middleware.js')

notificationRouter
  .route('/')
  .get(isAuthorized, getNotificationsValidator, catchAsync(NotificationControllers.getNotifications))

notificationRouter
  .route('/:notificationId')
  .put(isAuthorized, updateNotificationValidator, catchAsync(NotificationControllers.updateNotification))

module.exports = notificationRouter
