const { friendRequestStatus, conversationType } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { FRIEND_REQUEST_MESSAGES, CONVERSATION_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')
class FriendServices {
  async getListFriend({ userId, page, limit, search }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const friendWhere = {}
    if (search) {
      friendWhere[db.Sequelize.Op.or] = [
        { firstName: { [db.Sequelize.Op.like]: `%${search}%` } },
        { lastName: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }
    const { rows, count } = await db.Friend.findAndCountAll({
      where: { userId },
      include: [
        {
          model: db.User,
          where: friendWhere,
          attributes: ['userId', 'email', 'firstName', 'lastName', 'avatar']
        }
      ],
      distinct: true,
      offset,
      limit
    })
    return {
      data: rows,
      pagination: { total: count, page, limit }
    }
  }

  async sendFriendRequest({ senderId, receiverId }) {
    if (senderId === receiverId) {
      throw new AppError(FRIEND_REQUEST_MESSAGES.CANNOT_SEND_REQUEST_TO_YOURSELF, HTTP_STATUS.UNPROCESSABLE_ENTITY)
    }
    const existingRequest = await db.FriendRequest.findOne({
      where: {
        senderId,
        receiverId
      }
    })
    if (existingRequest) {
      existingRequest.status = friendRequestStatus.Pending
      await existingRequest.changed('updatedAt', true)
      await existingRequest.save()
      return existingRequest
    }
    const friendRequest = await db.FriendRequest.create({
      senderId,
      receiverId,
      status: friendRequestStatus.Pending
    })
    return friendRequest
  }
  async acceptFriendRequest({ requestId }) {
    const t = await db.sequelize.transaction()
    try {
      const friendRequest = await db.FriendRequest.findByPk(requestId, { transaction: t })
      if (!friendRequest) {
        throw new AppError(FRIEND_REQUEST_MESSAGES.FRIEND_REQUEST_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      friendRequest.status = friendRequestStatus.Accepted
      await friendRequest.save({ transaction: t })
      await db.Friend.create({ userId: friendRequest.senderId, friendId: friendRequest.receiverId }, { transaction: t })
      await db.Friend.create({ userId: friendRequest.receiverId, friendId: friendRequest.senderId }, { transaction: t })
      const conversation = await db.Conversation.create(
        {
          type: conversationType.Private
        },
        { transaction: t }
      )
      if (!conversation) {
        throw new AppError(CONVERSATION_MESSAGES.CREATED_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      }
      await db.ConversationMember.bulkCreate(
        [
          { conversationId: conversation.conversationId, userId: friendRequest.senderId },
          { conversationId: conversation.conversationId, userId: friendRequest.receiverId }
        ],
        { transaction: t }
      )
      await t.commit()
      return friendRequest
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
  }
  async declineFriendRequest({ requestId }) {
    const friendRequest = await db.FriendRequest.findByPk(requestId)
    if (!friendRequest) {
      throw new AppError(FRIEND_REQUEST_MESSAGES.FRIEND_REQUEST_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    friendRequest.status = friendRequestStatus.Rejected
    await friendRequest.save()
    return friendRequest
  }
  async getListFriendRequest({ userId, page, limit, search }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = { receiverId: userId, status: friendRequestStatus.Pending }
    if (search) {
      whereClause['$Sender.firstName$'] = { [db.Sequelize.Op.like]: `%${search}%` }
      whereClause['$Sender.lastName$'] = { [db.Sequelize.Op.like]: `%${search}%` }
    }
    const { rows: friendRequests, count } = await db.FriendRequest.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['senderId', 'receiverId'] },
      include: [
        {
          model: db.User,
          as: 'sender',
          attributes: ['userId', 'email', 'firstName', 'lastName', 'avatar']
        }
      ],
      offset,
      limit
    })
    return {
      data: friendRequests,
      pagination: {
        total: count,
        page,
        limit
      }
    }
  }
  async removeFriend({ userId, friendId }) {
    const t = await db.sequelize.transaction()
    try {
      const deletedCount1 = await db.Friend.destroy({
        where: { userId, friendId },
        transaction: t
      })
      const deletedCount2 = await db.Friend.destroy({
        where: { userId: friendId, friendId: userId },
        transaction: t
      })
      await t.commit()
      return true
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
  }
  async countFriendRequests({ userId }) {
    const count = await db.FriendRequest.count({
      where: {
        receiverId: userId,
        status: friendRequestStatus.Pending
      }
    })
    return count
  }
}
module.exports = new FriendServices()
