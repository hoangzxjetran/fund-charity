const { volunteerStatus } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { VOLUNTEER_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')

class VolunteersServices {
  async getVolunteersInCampaign(campaignId, params) {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC', status } = params
    const offset = (page - 1) * limit

    const whereClause = { campaignId }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { '$volunteer.firstName$': { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { '$volunteer.lastName$': { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { '$volunteer.email$': { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    const { rows, count } = await db.VolunteerRegistration.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['status', 'userId']
      },
      include: [
        {
          model: db.User,
          as: 'volunteer',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        },
        {
          model: db.VolunteerStatus,
          as: 'statusInfo',
          attributes: ['statusId', 'statusName']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    })

    const formattedData = rows.map((row) => ({
      registrationId: row.registrationId,
      registrationDate: row.registrationDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      volunteer: {
        userId: row.volunteer.userId,
        firstName: row.volunteer.firstName,
        lastName: row.volunteer.lastName,
        email: row.volunteer.email,
        statusInfo: {
          statusId: row.statusInfo.statusId,
          statusName: row.statusInfo.statusName
        }
      }
    }))
    return {
      data: formattedData,
      pagination: {
        total: count,
        page: +page,
        limit: +limit
      }
    }
  }

  async registerToCampaign({ campaignId, userId, registrationDate }) {
    const isSuccess = await db.VolunteerRegistration.create({
      campaignId,
      userId,
      registrationDate,
      status: volunteerStatus.PendingApproval
    })
    if (!isSuccess) {
      throw new AppError(VOLUNTEER_MESSAGES.REGISTRATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
    return true
  }
}

module.exports = new VolunteersServices()
