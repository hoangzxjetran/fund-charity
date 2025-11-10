const { milestoneStatus, fundraisingMethod, fundStatus } = require('../constants/enum.js')
const db = require('../models/index.js')

class FundsServices {
  async createFund(data) {
    const t = await db.sequelize.transaction()
    try {
      const { methodId, milestones, startDate, endDate, targetAmount, mediaFund, ...fundData } = data
      const fund = await db.Fund.create(
        {
          ...fundData,
          methodId,
          startDate,
          endDate,
          targetAmount: targetAmount,
          currentAmount: 0,
          status: fundStatus.Active
        },
        { transaction: t }
      )
      if (fund) {
        let createdMedia = []
        if (mediaFund && mediaFund.length > 0) {
          const mediaToCreate = mediaFund.map((i) => ({
            ...i,
            fundId: fund.fundId
          }))
          createdMedia = await db.FundMedia.bulkCreate(mediaToCreate, { transaction: t })
        }

        // Time-based
        if (methodId === fundraisingMethod.TimeBased) {
          await t.commit()
          return { ...fund, mediaFund: createdMedia }
        }
        if (methodId === fundraisingMethod.Milestone) {
          // Milestone-based
          const milestonesToCreate = milestones.map((m) => ({
            ...m,
            fundId: fund.fundId,
            milestoneStatusId: milestoneStatus.Pending
          }))
          await db.Milestone.bulkCreate(milestonesToCreate, { transaction: t })
          await t.commit()
          return {
            ...fund,
            milestones: milestonesToCreate,
            mediaFund: createdMedia
          }
        }
      }
    } catch (error) {
      await t.rollback()
      console.error('❌ Transaction rolled back:', error)
    }
  }

  async getFunds({ page = 1, limit = 10, search, methodId, categoryId, status, sortBy, sortOrder }) {
    const offset = (page - 1) * limit
    const whereClause = {}
    if (search) {
      whereClause.fundName = { [db.Sequelize.Op.iLike]: `%${search}%` }
    }
    if (methodId) {
      whereClause.methodId = methodId
    }
    if (categoryId) {
      whereClause.categoryFund = categoryId
    }
    if (status) {
      whereClause.status = status
    }

    const orderClause = []
    if (sortBy) {
      const orderDirection = sortOrder && sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      orderClause.push([sortBy, orderDirection])
    } else {
      orderClause.push(['createdAt', 'DESC'])
    }

    const { rows: funds, count: total } = await db.Fund.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: orderClause,
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['userId', 'firstName', 'lastName', 'email']
        },
        {
          model: db.FundraisingMethod,
          as: 'fundraising',
          attributes: ['methodId', 'methodName']
        },
        {
          model: db.FundStatus,
          as: 'fundStatus',
          attributes: ['fundStatusId', 'fundStatusName']
        },
        {
          model: db.CategoryFund,
          as: 'fundCategory',
          attributes: ['categoryId', 'categoryName']
        }
      ]
    })

    return {
      funds,
      pagination: {
        total,
        page: +page,
        limit: +limit
      }
    }
  }
}

module.exports = new FundsServices()
