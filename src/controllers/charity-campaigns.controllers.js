const HTTP_STATUS = require('../constants/httpStatus')
const charityCampaignsServices = require('../services/charity-campaigns.services')

class CharityCampaignsControllers {
  async getCampaigns(req, res, next) {
    const { fundId } = req.params
    const data = await charityCampaignsServices.getCampaigns(fundId)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async createCampaign(req, res, next) {
    const { fundId } = req.params
    const campaignData = req.body
    // Logic to create a new campaign would go here
    const data = await charityCampaignsServices.createCampaign(fundId, campaignData)
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }

  async updateCampaign(req, res, next) {
    const { campaignId } = req.params
    const updateData = req.body
    const result = await charityCampaignsServices.updateCampaign(campaignId, updateData)
    res.status(HTTP_STATUS.OK).json({
      result
    })
  }

  async deleteCampaign(req, res, next) {
    const { campaignId } = req.params
    const result = await charityCampaignsServices.deleteCampaign(campaignId)
    res.status(HTTP_STATUS.OK).json({
      result
    })
  }
}
module.exports = new CharityCampaignsControllers()
