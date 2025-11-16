const { roleType } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus')
const { USER_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const usersServices = require('../services/users.services')
const { verifyToken } = require('../utils/jwt')

const isAuthorized = async (req, res, next) => {
  try {
    const headers = req?.headers
    const accessToken = headers.authorization?.slice('Bearer '.length)
    if (!headers || !accessToken) {
      next(new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED))
      return
    }
    const decodedToken = await verifyToken(accessToken)
    if (decodedToken) {
      const freshUser = await usersServices.getUserById(decodedToken.userId)
      if (!freshUser) {
        next(new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED))
        return
      }
      const { refreshToken, ...userData } = freshUser
      req.user = userData
    }
    next()
  } catch (error) {
    next(error)
  }
}

const isAdmin = (req, res, next) => {
  const user = req.user
  if (!user) {
    return next(new AppError(USER_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN))
  }
  const hasAdminRole = user.roles?.some((userRole) => userRole.role?.roleId === roleType.Admin)

  if (!hasAdminRole) {
    return next(new AppError(USER_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN))
  }

  next()
}

module.exports = {
  isAuthorized,
  isAdmin
}
