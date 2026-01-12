const db = require('../models/index.js')

class ConversationServices {
  async getConversations({ userId, page, limit, search }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit

    const userWhere = {
      userId: { [db.Sequelize.Op.ne]: userId }
    }

    if (search) {
      userWhere[db.Sequelize.Op.or] = [
        { '$members.user.firstName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$members.user.lastName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$members.user.email$': { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }

    const { rows, count } = await db.Conversation.findAndCountAll({
      where: {
        conversationId: {
          [db.Sequelize.Op.in]: db.Sequelize.literal(`
          (SELECT conversationId
           FROM ConversationMembers
           WHERE userId = ${userId})
        `)
        }
      },
      include: [
        {
          model: db.ConversationMember,
          as: 'members',
          required: true,
          attributes: {
            exclude: ['conversationId', 'userId']
          },
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['userId', 'email', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
      distinct: true
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
}

module.exports = new ConversationServices()
