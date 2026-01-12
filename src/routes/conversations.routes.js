const { Router } = require('express')
const catchAsync = require('../middlewares/catchAsync.middleware')
const conversationControllers = require('../controllers/conversations.controllers')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const { getConversationsValidator } = require('../validations/conversations.validations')
const conversationRouter = Router()

conversationRouter.get(
  '/',
  isAuthorized,
  getConversationsValidator,
  catchAsync(conversationControllers.getConversations)
)
module.exports = conversationRouter
