const { campaignStatus } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { REPORT_MESSAGES, CAMPAIGN_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')
const { sendCloseCampaignEmail } = require('../utils/s3-ses.js')
const { getIO } = require('../utils/socket.js')
class ReportServices {
  async create({ reporterId, targetId, reasonId, description }) {
    const newReport = await db.Report.create({
      reporterId,
      targetType: 'campaign',
      targetId,
      reasonId,
      description,
      status: 'pending'
    })
    const report = await db.Report.findOne({
      where: { reportId: newReport.reportId },
      attributes: {
        exclude: ['reporterId', 'reasonId', 'targetId']
      },
      include: [
        {
          model: db.ReportReason,
          as: 'reason',
          attributes: ['reasonId', 'title']
        },
        {
          model: db.User,
          as: 'reporter',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        },
        {
          model: db.Campaign,
          as: 'target',
          attributes: ['campaignId', 'title']
        }
      ]
    })

    return report
  }
  async getAll({ page, limit, status, search, campaignId, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = {}
    if (status) whereClause.status = status
    if (campaignId) whereClause.targetId = campaignId
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { description: { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$reporter.firstName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$reporter.lastName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$reporter.email$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$target.title$': { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }

    const { rows, count } = await db.Report.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['reporterId', 'reasonId', 'targetId']
      },
      include: [
        {
          model: db.ReportReason,
          as: 'reason',
          attributes: ['reasonId', 'title']
        },
        {
          model: db.User,
          as: 'reporter',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        },

        {
          model: db.Campaign,
          as: 'target',
          attributes: ['campaignId', 'title', 'statusId', 'orgId'],
          include: [
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['createdBy'],
              include: [
                {
                  model: db.User,
                  as: 'creator',
                  attributes: ['userId', 'firstName', 'lastName', 'email']
                }
              ]
            }
          ]
        }
      ],
      order: [sortBy === 'campaign' ? [{ model: db.Campaign, as: 'target' }, 'title', sortOrder] : [sortBy, sortOrder]],
      limit,
      offset,
      distinct: true
    })

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit
      }
    }
  }
  async updateStatus({ reportId, status }) {
    const transaction = await db.sequelize.transaction()
    try {
      const report = await db.Report.findOne({
        where: { reportId },
        include: [
          {
            model: db.ReportReason,
            as: 'reason',
            attributes: ['reasonId', 'title']
          },
          {
            model: db.User,
            as: 'reporter',
            attributes: ['userId', 'firstName', 'lastName', 'email']
          },
          {
            model: db.Campaign,
            as: 'target',
            attributes: ['campaignId', 'title', 'statusId', 'orgId'],
            attributes: ['campaignId', 'title', 'statusId', 'orgId'],
            include: [
              {
                model: db.Organization,
                as: 'organization',
                attributes: ['createdBy'],
                include: [
                  {
                    model: db.User,
                    as: 'creator',
                    attributes: ['userId', 'firstName', 'lastName', 'email']
                  }
                ]
              }
            ]
          }
        ],
        transaction
      })

      if (!report) {
        throw new AppError(REPORT_MESSAGES.REPORT_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      if (status === 'approved') {
        const campaign = report.target
        if (campaign.statusId === campaignStatus.Closed) {
          throw new AppError(CAMPAIGN_MESSAGES.CLOSED, HTTP_STATUS.BAD_REQUEST)
        }
        await campaign.update({ statusId: campaignStatus.Closed }, { transaction })
      }
      await report.update({ status }, { transaction })
      if (status === 'approved') {
        const creatorId = report.target.organization.createdBy
        const notify = await db.Notification.create(
          {
            userId: creatorId,
            title: 'Chiến dịch đã bị đóng',
            content: `Chiến dịch "${report.target.title}" của bạn đã bị đóng sau quá trình xem xét báo cáo.`
          },
          { transaction }
        )
        const io = getIO()
        io.to(String(creatorId)).emit('notification', notify)
        await sendCloseCampaignEmail({
          toAddress: report.target.organization.creator.email,
          campaignName: report.target.title,
          userName: `${report.target.organization.creator.firstName} ${report.target.organization.creator.lastName}`,
          campaignId: report.target.campaignId
        })
      }
      await transaction.commit()
      return report
    } catch (error) {
      if (!transaction.finished) await transaction.rollback()
      throw error
    }
  }
}

module.exports = new ReportServices()
