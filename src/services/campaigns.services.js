const db = require('../models/index')
const { AppError } = require('../controllers/error.controllers')
const HTTP_STATUS = require('../constants/httpStatus')
const { CAMPAIGN_MESSAGES } = require('../constants/message')
const { campaignStatus, walletType, walletStatus } = require('../constants/enum')
class CampaignsServices {
  async getCampaigns({ orgId, page, limit, search, sortBy, sortOrder, status, categoryId }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = { orgId }
    if (search) {
      whereClause.title = { [db.Sequelize.Op.like]: `%${search}%` }
    }
    if (status) {
      whereClause.statusId = status
    }
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    const { rows: campaigns, count } = await db.Campaign.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      attributes: { exclude: ['statusId', 'categoryId'] },
      distinct: true,
      col: 'campaignId',
      include: [
        {
          model: db.CategoryFundraising,
          as: 'category',
          attributes: ['categoryId', 'categoryName', 'logoIcon']
        },
        {
          model: db.CampaignStatus,
          as: 'status',
          attributes: ['campaignStatusId', 'statusName']
        },
        {
          model: db.OrgBank,
          as: 'bankDetails'
        },
        {
          model: db.CampaignMedia,
          as: 'media',
          attributes: { exclude: ['mediaTypeId'] },
          include: [
            {
              model: db.Media,
              as: 'mediaType',
              attributes: ['mediaTypeId', 'mediaName']
            }
          ]
        }
      ]
    })

    return {
      data: campaigns,
      pagination: {
        page,
        limit,
        total: count
      }
    }
  }

  async createCampaign(data) {
    const transaction = await db.sequelize.transaction()
    let newCampaign = null
    try {
      const {
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
        media = []
      } = data
      newCampaign = await db.Campaign.create(
        {
          orgId,
          categoryId,
          title,
          description,
          startDate,
          endDate,
          targetAmount,
          currentAmount: 0,
          statusId: campaignStatus.Active
        },
        { transaction }
      )
      await db.OrgBank.create(
        {
          orgId,
          bankName,
          accountNumber: bankAccount,
          branch,
          accountHolder,
          campaignId: newCampaign.campaignId
        },
        { transaction }
      )
      await db.Wallet.create(
        {
          walletTypeId: walletType.Campaign,
          ownerId: userId,
          statusId: walletStatus.Active,
          campaignId: newCampaign.campaignId
        },
        { transaction }
      )
      if (media.length > 0) {
        const mediaRecords = media.map((item) => ({
          campaignId: newCampaign.campaignId,
          url: item.url,
          mediaTypeId: item.mediaTypeId
        }))

        await db.CampaignMedia.bulkCreate(mediaRecords, { transaction })
      }
      await transaction.commit()
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
      throw error
    }
    const createdCampaign = await db.Campaign.findOne({
      where: { campaignId: newCampaign.campaignId },
      attributes: { exclude: ['statusId', 'categoryId'] },
      include: [
        {
          model: db.CategoryFundraising,
          as: 'category',
          attributes: ['categoryId', 'categoryName', 'logoIcon']
        },
        {
          model: db.CampaignStatus,
          as: 'status'
        },
        {
          model: db.OrgBank,
          as: 'bankDetails'
        },
        {
          model: db.CampaignMedia,
          as: 'media',
          attributes: { exclude: ['mediaTypeId'] },
          include: [
            {
              model: db.Media,
              as: 'mediaType',
              attributes: ['mediaTypeId', 'mediaName']
            }
          ]
        }
      ]
    })

    return createdCampaign
  }

  async getCampaignById(campaignId) {
    const campaign = await db.Campaign.findOne({
      where: { campaignId },
      attributes: { exclude: ['statusId', 'categoryId', 'orgId'] },
      include: [
        {
          model: db.Organization,
          as: 'organization',
          attributes: ['orgId', 'orgName', 'orgName', 'avatar']
        },
        {
          model: db.CategoryFundraising,
          as: 'category',
          attributes: ['categoryId', 'categoryName', 'logoIcon']
        },
        {
          model: db.CampaignStatus,
          as: 'status'
        },
        {
          model: db.OrgBank,
          as: 'bankDetails',
          where: { campaignId }
        },
        {
          model: db.CampaignMedia,
          as: 'media',
          attributes: { exclude: ['mediaTypeId'] },
          include: [
            {
              model: db.Media,
              as: 'mediaType',
              attributes: ['mediaTypeId', 'mediaName']
            }
          ]
        }
      ]
    })
    if (!campaign) {
      throw new AppError(CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return campaign
  }

  async updateCampaign(campaignId, data) {
    const campaign = await db.Campaign.findByPk(campaignId, {
      include: [{ model: db.CampaignMedia, as: 'media' }]
    })
    if (!campaign) throw new AppError(CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND)

    return await db.sequelize.transaction(async (t) => {
      await campaign.update({ ...data }, { transaction: t })
      if (data.media) {
        const existingMediaUrls = campaign.media.map((m) => m.url)
        const mediaToDelete = existingMediaUrls.filter((url) => !data.media.some((m) => m.url === url))
        const mediaToAdd = data.media.filter((m) => !existingMediaUrls.includes(m.url))
        if (mediaToDelete.length) {
          await db.CampaignMedia.destroy({
            where: { campaignId, url: mediaToDelete },
            transaction: t
          })
          await deleteImageFromS3(mediaToDelete)
        }

        if (mediaToAdd.length) {
          const mediaRecords = mediaToAdd.map((m) => ({
            campaignId,
            url: m.url,
            mediaTypeId: m.mediaTypeId
          }))
          await db.CampaignMedia.bulkCreate(mediaRecords, { transaction: t })
        }
      }
      const updateCampaign = await db.Campaign.findByPk(campaignId, {
        include: [
          { model: db.CampaignMedia, as: 'media' },
          { model: db.CategoryFundraising, as: 'category' },
          { model: db.CampaignStatus, as: 'status' }
        ],
        transaction: t
      })
      return updateCampaign
    })
  }

  async deleteCampaign(campaignId) {
    const result = await db.Campaign.destroy({
      where: { campaignId }
    })
    if (!result) {
      throw new AppError(CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return !!result
  }

  async getAll({ page, limit, search, sortBy, sortOrder, status, categoryId, userId }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = {}
    if (search) {
      whereClause.title = { [db.Sequelize.Op.like]: `%${search}%` }
    }
    if (status) {
      whereClause.statusId = status
    }
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    const organizationInclude = {
      model: db.Organization,
      as: 'organization',
      attributes: ['orgId', 'orgName', 'avatar']
    }
    if (userId) {
      organizationInclude.where = {
        createdBy: userId
      }
      organizationInclude.required = true
    }

    const { rows: campaigns, count } = await db.Campaign.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      attributes: { exclude: ['statusId', 'categoryId', 'orgId'] },
      distinct: true,
      col: 'campaignId',
      include: [
        organizationInclude,
        {
          model: db.CategoryFundraising,
          as: 'category',
          attributes: ['categoryId', 'categoryName', 'logoIcon']
        },
        {
          model: db.CampaignStatus,
          as: 'status',
          attributes: ['campaignStatusId', 'statusName']
        },
        {
          model: db.CampaignMedia,
          as: 'media',
          attributes: { exclude: ['mediaTypeId'] },
          include: [
            {
              model: db.Media,
              as: 'mediaType',
              attributes: ['mediaTypeId', 'mediaName']
            }
          ]
        }
      ]
    })
    return {
      data: campaigns,
      pagination: {
        page,
        limit,
        total: count
      }
    }
  }
}
module.exports = new CampaignsServices()
