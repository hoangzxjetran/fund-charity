const isAuthorized = async (req, res, next) => {
  try {
    // const headers = req?.headers
    // const accessToken = headers.authorization?.slice('Bearer '.length)
    // if (!headers || !accessToken) {
    //   next(new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED))
    //   return
    // }
    // const decodedToken = await verifyToken(accessToken)
    // if (decodedToken) {
    //   const freshUser = await databaseServices.users.findOne({ _id: new ObjectId(decodedToken.userId) })
    //   if (!freshUser) {
    //     next(new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED))
    //     return
    //   }
    //   req.user = freshUser
    // }
    next()
  } catch (error) {
    next(error)
  }
}

const isAdmin = (req, res, next) => {
  const user = req.user
  // if (!user || user.role_id !== RoleType.Admin) {
  //   next(new AppError(USER_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN))
  //   return
  // }
  next()
}

module.export = {
  isAuthorized,
  isAdmin
}
