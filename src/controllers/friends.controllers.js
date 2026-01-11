const HTTP_STATUS = require('../constants/httpStatus')
const friendsServices = require('../services/friends.services')

class FriendControllers {
  async getListFriend(req, res) {
    const { userId } = req.user
    const { page, limit, search } = req.query
    const data = await friendsServices.getListFriend({ userId, page, limit, search })
    res.status(HTTP_STATUS.OK).json(data)
  }
  async sendFriendRequest(req, res) {
    const { userId } = req.user
    const { receiverId } = req.body
    const data = await friendsServices.sendFriendRequest({ senderId: userId, receiverId })
    res.status(HTTP_STATUS.CREATED).json({ data })
  }
  async acceptFriendRequest(req, res) {
    const { requestId } = req.params
    const data = await friendsServices.acceptFriendRequest({ requestId })
    res.status(HTTP_STATUS.OK).json({ data })
  }
  async declineFriendRequest(req, res) {
    const { requestId } = req.params
    const data = await friendsServices.declineFriendRequest({ requestId })
    res.status(HTTP_STATUS.OK).json({ data })
  }
  async getListFriendRequest(req, res) {
    const { userId } = req.user
    const { page, limit, search } = req.query
    const data = await friendsServices.getListFriendRequest({ userId, page, limit, search })
    res.status(HTTP_STATUS.OK).json(data)
  }
  async removeFriend(req, res) {
    const { userId } = req.user
    const { friendId } = req.params
    const result = await friendsServices.removeFriend({ userId, friendId })
    res.status(HTTP_STATUS.OK).json({ data: result })
  }
  async countFriendRequests(req, res) {
    const { userId } = req.user
    const count = await friendsServices.countFriendRequests({ userId })
    res.status(HTTP_STATUS.OK).json({ data: { count } })
  }
}

module.exports = new FriendControllers()
