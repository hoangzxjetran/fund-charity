const HTTP_STATUS = require('../constants/httpStatus')
const OrganizationServices = require('../services/organizations.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class OrganizationControllers {
  async createOrganization(req, res) {
    const { userId } = req.user
    const {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      banks
    } = req.body
    const result = await OrganizationServices.createOrganization(userId, {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      banks
    })
    return res.status(HTTP_STATUS.CREATED).json({
      data: { ...result }
    })
  }
  async uploadOrgAvatar(req, res) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      ContentType: req.file?.mimetype,
      Key: req.file?.filename,
      Body: req.file?.buffer
    }
    const result = await uploadFileToS3(params)
    return res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }
  async getOrganizationById(req, res) {
    const { orgId } = req.params
    const result = await OrganizationServices.getOrganizationById(orgId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }
  async getOrganizations(req, res) {
    const { page, limit, search, sortBy, sortOrder, userId } = req.query
    const result = await OrganizationServices.getOrganizations({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      userId
    })
    return res.status(HTTP_STATUS.OK).json({
      ...result
    })
  }

  async updateOrganization(req, res) {
    const { orgId } = req.params
    const {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      media,
      banks
    } = req.body
    const result = await OrganizationServices.updateOrganization(orgId, {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      media,
      banks
    })
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }

  async uploadMedia(req, res) {
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

  async approvedOrganization(req, res) {
    const { orgId } = req.params
    const result = await OrganizationServices.approvedOrganization(orgId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }
  async rejectedOrganization(req, res) {
    const { orgId } = req.params
    const result = await OrganizationServices.rejectedOrganization(orgId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }
}
module.exports = new OrganizationControllers()
