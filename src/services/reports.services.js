const HTTP_STATUS = require('../constants/httpStatus.js')
const { REPORT_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')
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
          attributes: ['campaignId', 'title']
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
    const report = await db.Report.findByPk(reportId)
    if (!report) {
      throw new AppError(REPORT_MESSAGES.REPORT_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    report.status = status
    await report.save()
    const updatedReport = await db.Report.findOne({
      where: { reportId: report.reportId },
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
    return updatedReport
  }
}

module.exports = new ReportServices()
