const HTTP_STATUS = require('../constants/httpStatus.js')
const usersServices = require('../services/users.services.js')
class UserControllers {
  async signUp(req, res) {
    const { firstName, lastName, dateOfBirth, email, password } = req.body
    const data = await usersServices.signUp({ firstName, lastName, dateOfBirth, email, password })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }

  async signIn(req, res) {
    const { email, password } = req.body
    const data = await usersServices.signIn({ email, password })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async forgotPassword(req, res) {
    const { email } = req.body
    const { userId } = req.user
    const data = await usersServices.forgotPassword({ userId, email })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }
}
module.exports = new UserControllers()
