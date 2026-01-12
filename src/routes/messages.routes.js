const { Router } = require('express')
const messageRouter = Router()
const catchAsync = require('../middlewares/catchAsync.middleware')
const messageControllers = require('../controllers/messages.controllers')
const { isAuthorized } = require('../middlewares/auth.middlewares')

messageRouter
  .route('/')
  .get(isAuthorized, catchAsync(messageControllers.getMessages))
  .post(isAuthorized, catchAsync(messageControllers.sendMessage))

module.exports = messageRouter
