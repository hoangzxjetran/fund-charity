const HTTP_STATUS = require('../constants/httpStatus.js')
const usersServices = require('../services/users.services.js')
class UserControllers {
  async signUp(req, res) {
    console.log(1)
    const { firstName, lastName, dateOfBirth, email, password } = req.body
    const data = await usersServices.signUp({ firstName, lastName, dateOfBirth, email, password })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }

  async signIn(req, res) {}
}
module.exports = new UserControllers()
