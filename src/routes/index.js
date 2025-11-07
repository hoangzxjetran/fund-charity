const AppError = require('../controllers/error.controllers.js')
const userRouter = require('./users.routes.js')
const HTTP_STATUS = require('../constants/httpStatus.js')

const route = (app) => {
  app.use('/v1/users', userRouter)

  app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS.NOT_FOUND))
  })
}

module.exports = route
