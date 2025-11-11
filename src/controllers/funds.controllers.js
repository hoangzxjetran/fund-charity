const HTTP_STATUS = require('../constants/httpStatus')
const fundsServices = require('../services/funds.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class FundsControllers {
  async uploadBannerFund(req, res) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      ContentType: req.file?.mimetype,
      Key: `fund/banner-${req.file?.filename}`,
      Body: req.file?.buffer
    }
    const result = await uploadFileToS3(params)
    return res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }

  async uploadMediaFund(req, res) {
    const files = req.files || []
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `fund/media-${file.filename}`,
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

  async createFund(req, res) {
    const body = req.body
    const { userId } = req.user
    const data = await fundsServices.createFund({ ...body, userId })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }

  async getFunds(req, res) {
    const { page, limit, search, methodId, categoryId, status, sortBy, sortOrder } = req.query
    const data = await fundsServices.getFunds({
      page,
      limit,
      search,
      methodId,
      categoryId,
      status,
      sortBy,
      sortOrder
    })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async getFundById(req, res) {
    const { fundId } = req.params
    const data = await fundsServices.getFundById(fundId)
    res.status(data ? HTTP_STATUS.OK : HTTP_STATUS.NOT_FOUND).json({
      data: data || null
    })
  }

  async updateFund(req, res) {
    const { fundId } = req.params
    const body = req.body
    const data = await fundsServices.updateFund(fundId, body)
    res.status(HTTP_STATUS.OK).json({
      data: data || null
    })
  }
}

module.exports = new FundsControllers()
