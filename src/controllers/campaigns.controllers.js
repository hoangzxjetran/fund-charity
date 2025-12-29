const HTTP_STATUS = require('../constants/httpStatus')
const campaignsServices = require('../services/campaigns.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class CampaignsControllers {
  async getAll(req, res, next) {
    const { page, limit, search, sortBy, sortOrder, status, categoryId, userId } = req.query
    const data = await campaignsServices.getAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
      categoryId,
      userId
    })
    res.status(HTTP_STATUS.OK).json(data)
  }
  async createCampaign(req, res, next) {
    const { orgId } = req.params
    const { userId } = req.user
    const {
      categoryId,
      title,
      description,
      startDate,
      endDate,
      targetAmount,
      bankName,
      bankAccount,
      branch,
      accountHolder,
      media
    } = req.body
    const data = await campaignsServices.createCampaign({
      userId,
      orgId,
      categoryId,
      title,
      description,
      startDate,
      endDate,
      targetAmount,
      bankName,
      bankAccount,
      branch,
      accountHolder,
      media
    })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }
  async uploadMedia(req, res, next) {
    const files = req.files || []
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: file.filename,
          Body: file.buffer,
          ContentType: file.mimetype
        }
        const uploaded = await uploadFileToS3(params)
        return uploaded
      })
    )
    return res.status(HTTP_STATUS.CREATED).json({
      data: uploadResults
    })
  }

  async getCampaignById(req, res, next) {
    const { campaignId } = req.params
    const data = await campaignsServices.getCampaignById(campaignId)
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }
  async getCampaigns(req, res, next) {
    const { orgId } = req.params
    const { page, limit, search, sortBy, sortOrder, status, categoryId } = req.query
    const data = await campaignsServices.getCampaigns({
      orgId,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
      categoryId
    })
    res.status(HTTP_STATUS.OK).json(data)
  }

  async updateCampaign(req, res, next) {
    const { campaignId } = req.params
    const updateData = req.body
    const result = await campaignsServices.updateCampaign(campaignId, updateData)
    res.status(HTTP_STATUS.OK).json({
      result
    })
  }

  async deleteCampaign(req, res, next) {
    const { campaignId } = req.params
    const result = await campaignsServices.deleteCampaign(campaignId)
    res.status(HTTP_STATUS.OK).json({
      result
    })
  }

  async approvedCampaign(req, res) {
    const { campaignId } = req.params
    const result = await campaignsServices.approvedCampaign(campaignId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }

  async rejectedCampaign(req, res) {
    const { campaignId } = req.params
    const result = await campaignsServices.rejectedCampaign(campaignId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }
}
module.exports = new CampaignsControllers()
