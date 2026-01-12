const HTTP_STATUS = require('../constants/httpStatus')
const messagesServices = require('../services/messages.services')

class MessageControllers {
  async getMessages(req, res) {
    // Implementation for fetching messages
    const { userId } = req.user
    const { conversationId, page, limit } = req.query
    const data = await messagesServices.getMessages({ userId, conversationId, page, limit })
    res.status(HTTP_STATUS.OK).json(data)
  }

  async sendMessage(req, res) {
    // Implementation for sending a message
  }
}
module.exports = new MessageControllers()
