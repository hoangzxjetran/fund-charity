const HTTP_STATUS = require('../constants/httpStatus.js')
const FundCategoriesServices = require('../services/fund-categories.services.js')
const { uploadFileToS3 } = require('../utils/s3-bucket.js')

class FundCategoriesControllers {
  async getFundCategories(req, res) {
    const { page, limit, search } = req.query
    const data = await FundCategoriesServices.getFundCategories({
      page,
      limit,
      search
    })
    res.status(HTTP_STATUS.OK).json({
      ...data
    })
  }
  async uploadLogoIcon(req, res) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      ContentType: req.file?.mimetype,
      Key: `fund-categories/${req.file?.filename}`,
      Body: req.file?.buffer
    }
    const result = await uploadFileToS3(params)
    return res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }
  async createFundCategory(req, res) {
    // Implementation for retrieving fund categories
    const { categoryName, logoIcon } = req.body
    const data = await FundCategoriesServices.createFundCategory({ categoryName, logoIcon })
    res.status(HTTP_STATUS.CREATED).json({
      data
    })
  }
}

module.exports = new FundCategoriesControllers()
