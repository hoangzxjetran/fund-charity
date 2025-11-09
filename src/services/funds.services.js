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
}

module.exports = new FundsServices()
