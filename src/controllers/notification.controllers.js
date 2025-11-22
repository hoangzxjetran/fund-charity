const HTTP_STATUS = require('../constants/httpStatus')
const notificationsServices = require('../services/notifications.services')

class NotificationControllers {
  async getNotifications(req, res, next) {
    const { userId } = req.user
    const { page, limit } = req.query
    const data = await notificationsServices.getNotificationsByUserId({ userId, page, limit })
    res.status(HTTP_STATUS.OK).json(data)
  }

  async updateNotification(req, res, next) {
    const { notificationId } = req.params
    const { isRead } = req.body
    const data = await notificationsServices.updateNotification({ notificationId, isRead })
    res.status(HTTP_STATUS.OK).json(data)
  }
}
module.exports = new NotificationControllers()
