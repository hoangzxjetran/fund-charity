const { Router } = require('express')
const {
  createCommentValidator,
  commentIdValidator,
  campaignIdValidator,
  getCommentsByCampaignIdValidator
} = require('../validations/comments.validations')
const commentsControllers = require('../controllers/comments.controllers')
const catchAsync = require('../middlewares/catchAsync.middleware')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const { uploadImagesComment, resizeImagesComment } = require('../middlewares/uploadFile.middlewares')

const commentRouter = Router()

commentRouter.post('/', isAuthorized, createCommentValidator, catchAsync(commentsControllers.createComment))
commentRouter.get(
  '/:campaignId',
  campaignIdValidator,
  getCommentsByCampaignIdValidator,
  catchAsync(commentsControllers.getComments)
)
commentRouter.delete('/:commentId', isAuthorized, commentIdValidator, catchAsync(commentsControllers.deleteComment))
commentRouter.post(
  '/uploads',
  isAuthorized,
  uploadImagesComment,
  resizeImagesComment,
  catchAsync(commentsControllers.uploadMedia)
)
module.exports = commentRouter
