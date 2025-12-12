const HTTP_STATUS = require('../constants/httpStatus.js')
const reportServices = require('../services/reports.services.js')
class ReportControllers {
  async create(req, res, next) {
    const { userId } = req.user
    const { targetId, reasonId, description } = req.body
    const data = await reportServices.create({
      reporterId: userId,
      targetId,
      reasonId,
      description
    })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }
  async getAll(req, res, next) {
    const { page, limit, status, search, campaignId, sortBy, sortOrder } = req.query
    const data = await reportServices.getAll({
      page,
      limit,
      status,
      campaignId,
      sortBy,
      sortOrder,
      search
    })
    res.status(HTTP_STATUS.OK).json(data)
  }
  async updateStatus(req, res, next) {
    const { reportId } = req.params
    const { status } = req.body
    const data = await reportServices.updateStatus({ reportId, status })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }
}

module.exports = new ReportControllers()
