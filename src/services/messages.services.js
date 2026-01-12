const db = require('../models/index.js')
class MessageServices {
  async getMessages({ conversationId, page, limit }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 20
    const offset = (page - 1) * limit
    const { rows: messages, count } = await db.Message.findAndCountAll({
      where: { conversationId },
      include: [
        {
          model: db.User,
          as: 'sender',
          attributes: ['userId', 'email', 'firstName', 'lastName', 'avatar']
        },
        {
          model: db.Conversation,
          as: 'conversation',
          attributes: ['conversationId', 'type', 'name']
        },
        {
          model: db.MessageMedia,
          as: 'media',
          include: [
            {
              model: db.Media,
              as: 'mediaType',
              attributes: ['mediaTypeId', 'mediaName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })
    return {
      data: messages,
      pagination: {
        page,
        limit,
        total: count
      }
    }
  }

  async sendMessage({ senderId, conversationId, content }) {
    // Implementation for sending a message
    const message = await db.Message.create({
      conversationId,
      senderId,
      content
    })
    return message
  }
}
module.exports = new MessageServices()
