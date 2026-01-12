const HTTP_STATUS = require('../constants/httpStatus')
const conversationsServices = require('../services/conversations.services')

class ConversationControllers {
  async getConversations(req, res) {
    const { userId } = req.user
    const { page, limit, search } = req.query
    const data = await conversationsServices.getConversations({ userId, page, limit, search })
    res.status(HTTP_STATUS.OK).json(data)
  }
}
module.exports = new ConversationControllers()
