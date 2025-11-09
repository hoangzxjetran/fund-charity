const HTTP_STATUS = require('../constants/httpStatus.js')
const usersServices = require('../services/users.services.js')
const { uploadFileToS3 } = require('../utils/s3-bucket.js')
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

  async verifyPasswordToken(req, res) {
    res.status(HTTP_STATUS.OK).json({
      data: true
    })
  }

  async resetPassword(req, res) {
    const { userId } = req.user
    const { password } = req.body
    await usersServices.resetPassword({ userId, plainTextPassword: password })
    res.status(HTTP_STATUS.OK).json({
      data: true
    })
  }

  async getProfile(req, res) {
    const user = req.user
    res.status(HTTP_STATUS.OK).json({
      data: user
    })
  }

  async changePassword(req, res) {
    const { userId } = req.user
    const { currentPassword, newPassword } = req.body
    const result = await usersServices.changePassword({ userId, currentPassword, newPassword })
    res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }

  async refreshToken(req, res) {
    const { userId } = req.user
    const { refreshToken } = req.body
    const data = await usersServices.refreshToken(userId, refreshToken)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async updateProfile(req, res) {
    const { userId } = req.user
    const body = req.body
    const data = await usersServices.updateProfile(userId, body)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async getUsers(req, res) {
    const data = await usersServices.getUsers({
      ...req.query,
      page: req.query.page || 1,
      limit: req.query.limit || 10
    })
    res.status(HTTP_STATUS.OK).json({
      ...data
    })
  }

  async getUser(req, res) {
    const { userId } = req.params
    const data = await usersServices.getUserById(userId)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async updateUser(req, res) {
    const { userId } = req.params
    const body = req.body
    const data = await usersServices.updateProfile(userId, body)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async deleteUser(req, res) {
    const { userId } = req.params
    const result = await usersServices.deleteUser(userId)
    res.status(HTTP_STATUS.NO_CONTENT).json({ data: result })
  }

  async uploadAvatarUser(req, res) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      ContentType: req.file?.mimetype,
      Key: `user/avatar-${req.file?.filename}`,
      Body: req.file?.buffer
    }
    const result = await uploadFileToS3(params)
    return res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }
}
module.exports = new UserControllers()
