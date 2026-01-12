const db = require('../models/index.js')
const { getIO } = require('../utils/socket.js')
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

  async sendMessage({ senderId, conversationId, content, media }) {
    const t = await db.sequelize.transaction()
    try {
      const message = await db.Message.create(
        {
          conversationId,
          senderId,
          content
        },
        { transaction: t }
      )
      if (media && Array.isArray(media) && media.length > 0) {
        const mediaRecords = media.map((item) => ({
          messageId: message.messageId,
          mediaUrl: item.url,
          mediaTypeId: item.mediaTypeId
        }))
        await db.MessageMedia.bulkCreate(mediaRecords, { transaction: t })
      }
      await t.commit()
      const newMessage = await db.Message.findOne({
        where: { messageId: message.messageId },
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
        ]
      })
      const io = getIO()
      io.to(`conversation-${conversationId}`).emit('newMessage', newMessage)
      return newMessage
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
  }
}
module.exports = new MessageServices()
