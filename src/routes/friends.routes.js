const { Router } = require('express')
const friendRouter = Router()
const catchAsync = require('../middlewares/catchAsync.middleware')
const friendControllers = require('../controllers/friends.controllers')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const {
  getListFriendValidator,
  getListFriendRequestValidator,
  friendRequestIdValidator,
  sendRequestValidator,
  friendIdValidator
} = require('../validations/friends.validations')

friendRouter.get('/', isAuthorized, getListFriendValidator, catchAsync(friendControllers.getListFriend))
friendRouter
  .route('/requests')
  .post(isAuthorized, sendRequestValidator, catchAsync(friendControllers.sendFriendRequest))
  .get(isAuthorized, getListFriendRequestValidator, catchAsync(friendControllers.getListFriendRequest))
friendRouter.post(
  '/requests/:requestId/accept',
  isAuthorized,
  friendRequestIdValidator,
  catchAsync(friendControllers.acceptFriendRequest)
)
friendRouter.post(
  '/requests/:requestId/decline',
  isAuthorized,
  friendRequestIdValidator,
  catchAsync(friendControllers.declineFriendRequest)
)
friendRouter.delete('/:friendId', isAuthorized, friendIdValidator, catchAsync(friendControllers.removeFriend))
friendRouter.get('/count-requests', isAuthorized, catchAsync(friendControllers.countFriendRequests))
module.exports = friendRouter
