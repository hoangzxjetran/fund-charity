const HTTP_STATUS = require('../constants/httpStatus')
const commentsServices = require('../services/comments.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class CommentsControllers {
  async createComment(req, res) {
    // Logic to create a comment
    const { userId } = req.user
    const { campaignId, content, media } = req.body
    const data = await commentsServices.createComment({ userId, campaignId, content, media })
    res.status(HTTP_STATUS.CREATED).json({ data })
  }

  async uploadMedia(req, res, next) {
    const files = req.files || []
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: file.filename,
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

  async deleteComment(req, res) {
    const { commentId } = req.params
    const result = await commentsServices.deleteComment({ commentId })
    res.status(HTTP_STATUS.OK).json({ data: result })
  }

  async getComments(req, res) {
    const { campaignId } = req.params
    // Logic to get comments by campaignId
    const { page, limit, sortBy, sortOrder } = req.query
    const data = await commentsServices.getCommentsByCampaignId({
      campaignId,
      page,
      limit,
      sortBy,
      sortOrder
    })
    res.status(HTTP_STATUS.OK).json(data)
  }
}
module.exports = new CommentsControllers()
