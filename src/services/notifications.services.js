const HTTP_STATUS = require('../constants/httpStatus')
const { NOTIFICATION_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const db = require('../models')
class NotificationServices {
  async getNotificationsByUserId({ userId, page, limit }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const { rows, count } = await db.Notification.findAndCountAll({
      where: { userId },
      attributes: { exclude: ['relatedDonationId', 'relatedWithdrawalId', 'relatedCampaignId'] },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: db.Campaign,
          as: 'campaign',
          attributes: ['campaignId', 'title', 'description']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit
      }
    }
  }

  async updateNotification({ notificationId, isRead }) {
    const resNotify = await db.Notification.findByPk(notificationId)
    const notification = resNotify.get({ plain: true })
    if (!notification) {
      throw new AppError(NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    notification.isRead = isRead
    await notification.save()
    return notification
  }

  async markAsRead({ notificationId }) {
    const notification = await db.Notification.findByPk(notificationId)
    if (!notification) {
      throw new AppError(NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    notification.isRead = true
    await notification.save()
    return true
  }

  async markAsReadAll({ userId }) {
    await db.Notification.update(
      { isRead: true },
      {
        where: { userId, isRead: false }
      }
    )
    return true
  }
}
module.exports = new NotificationServices()
