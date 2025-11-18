const { donationStatus, walletType } = require('../constants/enum.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { DONATION_MESSAGES } = require('../constants/message.js')
const db = require('../models/index.js')
const { createPaymentUrl } = require('../utils/vnpay')
class DonationsServices {
  async getDonationsByCampaign({ campaignId, page, limit, search = '', sortBy = 'donateDate', sortOrder = 'DESC' }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = { campaignId, paymentStatus: 'Success' }
    if (search) {
      whereClause['$or'] = [
        { '$User.firstName$': { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { '$User.lastName$': { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { '$User.email$': { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { email: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { phoneNumber: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ]
    }
    const { rows: donations, count: total } = await db.Donation.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.User, as: 'user', required: false },
        {
          model: db.Campaign,
          as: 'campaign',
          required: true
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    })
    return {
      donations,
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
        where: { ownerType: walletType.Admin },
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
}
module.exports = new DonationsServices()
