const HTTP_STATUS = require('../constants/httpStatus')
const messagesServices = require('../services/messages.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class MessageControllers {
  async getMessages(req, res) {
    // Implementation for fetching messages
    const { userId } = req.user
    const { conversationId, page, limit } = req.query
    const data = await messagesServices.getMessages({ userId, conversationId, page, limit })
    res.status(HTTP_STATUS.OK).json(data)
  }

  async sendMessage(req, res) {
    const { userId } = req.user
    const { conversationId, content, media } = req.body
    const data = await messagesServices.sendMessage({ senderId: userId, conversationId, content, media })
    res.status(HTTP_STATUS.CREATED).json(data)
  }
  async uploadMedia(req, res) {
    const files = req.files || []
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: file.filename || `message-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype
        }
        const uploaded = await uploadFileToS3(params)
        return uploaded
      })
    )
    return res.status(HTTP_STATUS.CREATED).json({
      data: uploadResults
    })
  }
}
module.exports = new MessageControllers()
