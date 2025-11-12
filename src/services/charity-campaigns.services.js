const db = require('../models/index')
const { AppError } = require('../controllers/error.controllers')
const HTTP_STATUS = require('../constants/httpStatus')
const { CAMPAIGN_MESSAGES } = require('../constants/message')
class CharityCampaignsServices {
  async getCampaigns(fundId) {
    const results = await db.CharityCampaign.findAll(
      {
        where: {
          fundId
        }
      },
      {
        include: [
          {
            model: db.Volunteer,
            as: 'volunteers'
          }
        ],
      }
    )
    return results
  }

  async createCampaign(fundId, data) {
    const newCampaign = await db.CharityCampaign.create({
      fundId,
      ...data
    })
    return newCampaign
  }
  async updateCampaign(campaignId, data) {
    const result = await db.CharityCampaign.update(data, {
      where: { campaignId },
      data: { ...data }
    })
    if (!result[0]) {
      throw new AppError(CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    const updatedCampaign = await db.CharityCampaign.findOne({
      where: { campaignId }
    })
    return updatedCampaign
  }

  async deleteCampaign(campaignId) {
    const result = await db.CharityCampaign.destroy({
      where: { campaignId }
    })
    if (!result) {
      throw new AppError(CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return !!result
  }
}
module.exports = new CharityCampaignsServices()
