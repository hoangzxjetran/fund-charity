const { endOfDay } = require('date-fns')
const { donationStatus, walletType } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { DONATION_MESSAGES } = require('../constants/message.js')
const db = require('../models/index.js')
const { createPaymentUrl } = require('../utils/vnpay')
class DonationsServices {
  async getDonationsByCampaign({
    campaignId,
    page,
    limit,
    search = '',
    sortBy = 'donateDate',
    sortOrder = 'DESC',
    startDate,
    endDate
  }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = { campaignId, statusId: donationStatus.Completed }
    if (search) {
      whereClause['$or'] = [
        { '$User.firstName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$User.lastName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$User.email$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { phoneNumber: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }
    if (startDate) {
      whereClause.donateDate = { [db.Sequelize.Op.gte]: new Date(startDate) }
    }
    if (endDate) {
      whereClause.donateDate = whereClause.donateDate || {}
      whereClause.donateDate[db.Sequelize.Op.lte] = new Date(endDate)
    }
    const { rows: donations, count: total } = await db.Donation.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['userId', 'statusId']
      },
      include: [
        { model: db.User, as: 'user', required: false },
        {
          model: db.DonationStatus,
          as: 'status'
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    })
    return {
      data: donations,
      pagination: {
        total,
        page,
        limit
      }
    }
  }

  async createDonation({ userId, campaignId, amount, isAnonymous = false }) {
    const t = await Donations.sequelize.transaction()
    try {
      // 1. create donation pending
      const donation = await db.Donation.create(
        {
          userId: isAnonymous ? null : userId,
          campaignId,
          amount,
          isAnonymous: !!isAnonymous,
          paymentStatus: donationStatus.Pending
        },
        { transaction: t }
      )
      await t.commit()
      const vnpUrl = createPaymentUrl({
        orderId: donation.donationId,
        amount,
        orderInfo: `Ủng hộ cho quỹ ${campaignId}`,
        ipAddr: req.ip
      })

      return res.json({ vnpUrl, donationId: donation.donationId })
    } catch (err) {
      await t.rollback()
    }
  }

  async processSuccessfulPayment({ donationId, amount }) {
    const t = await db.sequelize.transaction()
    try {
      const donation = await db.Donation.findOne({ where: { donationId }, transaction: t, lock: t.LOCK.UPDATE })
      if (!donation) throw new AppErrorError(DONATION_MESSAGES.DONATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      if (donation.paymentStatus === donationStatus.Completed) {
        await t.commit()
        return donation
      }

      const adminWallet = await db.Wallet.findOne({
        where: { walletTypeId: walletType.Campaign },
        transaction: t,
        lock: t.LOCK.UPDATE
      })
      const campaignWallet = await db.Campaign.update({
        where: { campaignId: donation.campaignId },
        currentAmount: donation.amount
      })
      if (!adminWallet || !campaignWallet) throw new Error('Wallets missing')
      donation.paymentStatus = 'success'
      donation.donateDate = new Date()
      await donation.save({ transaction: t })

      // update balances
      adminWallet.balance = Number(adminWallet.balance) + Number(amount)
      await adminWallet.save({ transaction: t })

      campaignWallet.balance = Number(campaignWallet.balance) + Number(amount)
      await campaignWallet.save({ transaction: t })

      // create transaction record
      await Transactions.create(
        { donationId: donation.donationId, walletId: adminWallet.walletId, amount, typeId: 1, statusId: 1 },
        { transaction: t }
      )

      await t.commit()

      // emit socket notifications (outside transaction)
      try {
        const io = getIO()
        const displayName = donation.isAnonymous ? 'Ẩn danh' : donation.userId ? `user_${donation.userId}` : 'Guest'
        if (donation.userId)
          io.to(String(donation.userId)).emit('donation_status', { donationId, status: 'success', amount })
        io.to('admin_room').emit('new_donation', { donationId, campaignId: donation.campaignId, displayName, amount })
        const campaign = await db.Campaign.findByPk(donation.campaignId)
        if (campaign && campaign.createdBy)
          io.to(String(campaign.createdBy)).emit('campaign_donation', {
            campaignId: donation.campaignId,
            amount,
            displayName
          })
      } catch (err) {
        console.error('socket emit err', err)
      }

      return donation
    } catch (err) {
      await t.rollback()
      throw err
    }
  }
  async getTop5Donors(includeAnonymous) {
    const whereClause = { statusId: donationStatus.Completed }
    const includeAnonymousBool = includeAnonymous === 'true'
    if (!includeAnonymousBool) {
      whereClause.isAnonymous = false
      whereClause.userId = { [db.Sequelize.Op.ne]: null }
    }
    return await db.Donation.findAll({
      where: whereClause,
      attributes: ['userId', [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalAmount']],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName', 'email', 'isShowAsAnonymous']
        }
      ],
      group: ['userId', 'user.userId'],
      order: [[db.Sequelize.literal('totalAmount'), 'DESC']],
      limit: 5
    })
  }
  async getTop5DonorsByCampaign({ campaignId, includeAnonymous }) {
    const whereClause = { statusId: donationStatus.Completed, campaignId }
    const includeAnonymousBool = includeAnonymous === 'true'
    if (!includeAnonymousBool) {
      whereClause.isAnonymous = false
      whereClause.userId = { [db.Sequelize.Op.ne]: null }
    }
    return await db.Donation.findAll({
      where: whereClause,
      attributes: ['userId', [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalAmount']],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName', 'email', 'isShowAsAnonymous']
        }
      ],
      group: ['userId', 'user.userId'],
      order: [[db.Sequelize.literal('totalAmount'), 'DESC']],
      limit: 5
    })
  }
  async getUserDonationsCampaignDisbursed({ campaignId, timeCloseCampaign }) {
    const donations = await await db.Donation.findAll({
      attributes: ['userId', [db.Sequelize.fn('SUM', db.Sequelize.col('Donation.amount')), 'totalAmount']],
      where: {
        statusId: donationStatus.Completed,
        campaignId,
        userId: {
          [db.Sequelize.Op.ne]: null
        },
        donateDate: {
          [db.Sequelize.Op.lte]: endOfDay(timeCloseCampaign)
        }
      },
      include: [
        {
          model: db.Campaign,
          as: 'campaign',
          attributes: ['campaignId', 'title']
        },
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'email', 'firstName', 'lastName'],
          where: {
            [db.Sequelize.Op.or]: [
              { email: { [db.Sequelize.Op.like]: 'danghoang0901zaqw%' } },
              { email: { [db.Sequelize.Op.like]: 'danghoang0901zaqwe%' } },
              { email: { [db.Sequelize.Op.like]: 'giabao712411%' } }
            ]
          }
        }
      ],
      group: ['Donation.userId', 'user.userId']
    })
    return donations
  }
}
module.exports = new DonationsServices()
