const { milestoneStatus, fundraisingMethod, fundStatus } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { FUND_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
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
          attributes: ['categoryId', 'categoryName', 'logoIcon']
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

  async getFundById(fundId) {
    const fund = await db.Fund.findByPk(fundId, {
      attributes: {
        exclude: ['methodId', 'categoryFund', 'status']
      },
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
          attributes: ['categoryId', 'categoryName', 'logoIcon']
        },
        {
          model: db.FundMedia,
          as: 'fundMedia',
          attributes: ['fundMediaId', 'mediaType', 'url']
        },
        {
          model: db.Milestone,
          as: 'milestones'
        }
      ]
    })
    return fund
  }

  async updateFund(fundId, data) {
    const t = await db.sequelize.transaction()
    try {
      const { methodId, milestones, mediaFund, ...fundData } = data
      const fund = await db.Fund.findByPk(fundId, { transaction: t })
      if (!fund) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, FUND_MESSAGES.NOT_FOUND)
      }
      const cleanFundData = Object.fromEntries(
        Object.entries(fundData).filter(([_, v]) => v !== undefined && v !== null)
      )
      await fund.update(cleanFundData, { transaction: t })
      if (mediaFund && mediaFund.length > 0) {
        await db.FundMedia.destroy({
          where: { fundId },
          transaction: t
        })

        const mediaToCreate = mediaFund.map((m) => ({
          ...m,
          fundId
        }))
        await db.FundMedia.bulkCreate(mediaToCreate, { transaction: t })
      }
      if (methodId === fundraisingMethod.Milestone && milestones) {
        await db.Milestone.destroy({
          where: { fundId },
          transaction: t
        })
        const milestonesToCreate = milestones.map((m) => ({
          ...m,
          fundId,
          milestoneStatusId: milestoneStatus.Pending
        }))
        await db.Milestone.bulkCreate(milestonesToCreate, { transaction: t })
      }
      await t.commit()
      const updatedFund = await db.Fund.findByPk(fundId, {
        attributes: {
          exclude: ['methodId', 'categoryFund', 'status']
        },
        include: [
          { model: db.User, as: 'creator', attributes: ['userId', 'firstName', 'lastName', 'email'] },
          { model: db.FundraisingMethod, as: 'fundraising', attributes: ['methodId', 'methodName'] },
          { model: db.FundStatus, as: 'fundStatus', attributes: ['fundStatusId', 'fundStatusName'] },
          { model: db.CategoryFund, as: 'fundCategory', attributes: ['categoryId', 'categoryName', 'logoIcon'] },
          { model: db.FundMedia, as: 'fundMedia' },
          { model: db.Milestone, as: 'milestones' }
        ]
      })
      return updatedFund
    } catch (error) {
      await t.rollback()
      console.error('❌ Update Fund failed, rolled back:', error)
      throw error
    }
  }
}

module.exports = new FundsServices()
