const db = require('../models')

class CommentsServices {
  async createComment({ userId, campaignId, content, media }) {
    const transaction = await db.sequelize.transaction()
    try {
      const comment = await db.Comment.create(
        {
          userId,
          campaignId,
          content
        },
        { transaction }
      )
      if (media && Array.isArray(media)) {
        const mediaToCreate = media.map((item) => ({
          ...item,
          commentId: comment.commentId
        }))
        await db.CommentMedia.bulkCreate(mediaToCreate, { transaction })
      }
      await transaction.commit()

      await comment.reload({
        attributes: {
          exclude: ['userId']
        },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['userId', 'firstName', 'lastName', 'email']
          },
          {
            model: db.CommentMedia,
            as: 'media',
            attributes: {
              exclude: ['commentId']
            },
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

      return comment
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
    }
  }

  async getCommentsByCampaignId({ campaignId, page, limit, sortBy, sortOrder }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    sortBy = sortBy || 'createdAt'
    sortOrder = sortOrder || 'DESC'
    const { rows, count } = await db.Comment.findAllAndCount({
      where: { campaignId, isDeleted: false },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    })
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count
      }
    }
  }

  async getCommentById(commentId) {
    const comment = await db.Comment.findOne({
      where: { id: commentId },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        }
      ]
    })
    return comment
  }
  async deleteComment({ commentId }) {
    const result = await db.Comment.update(
      { isDeleted: true },
      {
        where: { commentId }
      }
    )
    return result
  }
}

module.exports = new CommentsServices()
