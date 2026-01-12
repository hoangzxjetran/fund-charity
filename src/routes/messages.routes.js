const { Router } = require('express')
const messageRouter = Router()
const catchAsync = require('../middlewares/catchAsync.middleware')
const messageControllers = require('../controllers/messages.controllers')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const { getMessagesValidator, sendMessageValidator } = require('../validations/messages.validations')
const { resizeImageMessage, uploadImagesMessage, renameVideo } = require('../middlewares/uploadFile.middlewares')

messageRouter
  .route('/')
  .get(isAuthorized, getMessagesValidator, catchAsync(messageControllers.getMessages))
  .post(isAuthorized, sendMessageValidator, catchAsync(messageControllers.sendMessage))
messageRouter
  .route('/uploads')
  .post(isAuthorized, uploadImagesMessage, resizeImageMessage, catchAsync(messageControllers.uploadMedia))

module.exports = messageRouter
