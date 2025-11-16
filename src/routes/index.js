const { AppError } = require('../controllers/error.controllers.js')
const userRouter = require('./users.routes.js')
const organizationsRouter = require('./organizations.routes.js')
const fundCategoriesRouter = require('./fund-categories.routes.js')
const fundRouter = require('./funds.routes.js')
const campaignsRouter = require('./campaigns.routes.js')

const volunteersRouter = require('./volunteers.routes.js')
const HTTP_STATUS = require('../constants/httpStatus.js')

const route = (app) => {
  app.use('/v1/users', userRouter)
  app.use('/v1/organizations', organizationsRouter)
  app.use('/v1/campaigns', campaignsRouter)
  app.use('/v1/fund-categories', fundCategoriesRouter)
  app.use('/v1/volunteers', volunteersRouter)

  app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS.NOT_FOUND))
  })
}

module.exports = route
