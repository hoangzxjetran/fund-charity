const HTTP_STATUS = require('../constants/httpStatus')
const volunteersServices = require('../services/volunteers.services')

class VolunteersControllers {
  async getVolunteers(req, res, next) {
    const { campaignId } = req.params
    // Placeholder logic for getting volunteers in a fund
    const { page, limit, search, sortBy, sortOrder, status } = req.query
    const data = await volunteersServices.getVolunteersInCampaign(campaignId, {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status
    })
    res.status(HTTP_STATUS.OK).json(data)
  }

  async registerCampaign(req, res, next) {
    const { campaignId } = req.params
    const { userId } = req.user
    const { registrationDate } = req.body
    const result = await volunteersServices.registerToCampaign({ campaignId, userId, registrationDate })
    res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }

  async updateStatus(req, res) {
    const { registrationId } = req.params
    const { status } = req.body
    const data = await volunteersServices.updateStatus({
      registrationId,
      status
    })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }
}
module.exports = new VolunteersControllers()
