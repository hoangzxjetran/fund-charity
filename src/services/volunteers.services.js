const { volunteerStatus } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { VOLUNTEER_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')

class VolunteersServices {
  async getVolunteersInCampaign({
    campaignId,
    page,
    limit,
    search = '',
    sortBy = 'registeredAt',
    sortOrder = 'DESC',
    statusId
  }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = { campaignId }

    if (statusId) whereClause.statusId = statusId
    const userWhere = {}
    if (search && search.trim() !== '') {
      const like = { [db.Sequelize.Op.like]: `%${search}%` }
      userWhere[db.Sequelize.Op.or] = [{ firstName: like }, { lastName: like }, { email: like }]
    }
    const { rows, count } = await db.VolunteerRegistration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'userInfo',
          attributes: ['userId', 'firstName', 'lastName', 'email'],
          ...(search ? { where: userWhere } : {})
        },
        {
          model: db.VolunteerStatus,
          as: 'status',
          attributes: ['volunteerStatusId', 'statusName']
        }
      ],
      attributes: { exclude: ['userId', 'statusId'] },
      order: [[sortBy, sortOrder]],
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

  async registerToCampaign({ campaignId, userId }) {
    const result = await db.VolunteerRegistration.create({
      campaignId,
      userId,
      registeredAt: new Date(),
      statusId: volunteerStatus.PendingApproval
    })
    const volunteer = await result.reload({
      attributes: {
        exclude: ['statusId']
      },
      include: [
        {
          model: db.VolunteerStatus,
          as: 'status',
          attributes: ['volunteerStatusId', 'statusName']
        }
      ]
    })
    return volunteer
  }
  async updateStatus({ registrationId, statusId }) {
    const existing = await db.VolunteerRegistration.findByPk(registrationId)
    if (!existing) {
      throw new AppError(VOLUNTEER_MESSAGES.REGISTRATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    await existing.update({ statusId })
    const updated = await existing.reload({
      include: [
        {
          model: db.VolunteerStatus,
          as: 'status',
          attributes: ['volunteerStatusId', 'statusName']
        },
        {
          model: db.User,
          as: 'volunteer',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        }
      ]
    })

    return updated
  }
}

module.exports = new VolunteersServices()
