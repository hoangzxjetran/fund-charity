const { donationStatus, walletType, transactionType, transactionStatus } = require('../constants/enum')
const { DONATION_MESSAGES } = require('../constants/message')
const db = require('../models')
const { getIO } = require('../utils/socket')
const { AppError } = require('../controllers/error.controllers.js')
const HTTP_STATUS = require('../constants/httpStatus')
const { createPaymentUrl, verifyResponse } = require('../utils/vnpay')
class PaymentServices {
  async createPayment({
    userId,
    email,
    address,
    phoneNumber,
    message,
    campaignId,
    amount,
    isAnonymous = false,
    ipAddr
  }) {
    const t = await db.sequelize.transaction()
    try {
      const response = await db.Donation.create(
        {
          userId,
          campaignId,
          amount,
          isAnonymous: isAnonymous,
          email,
          address,
          phoneNumber,
          message,
          donateDate: new Date(),
          statusId: donationStatus.Pending
        },
        { transaction: t }
      )
      const {
        dataValues: { donationId }
      } = response
      await t.commit()
      const paymentUrl = createPaymentUrl({
        donationId,
        amount,
        orderInfo: `Ung_ho_camp_${campaignId}_donation_${response.donationId}_user_${userId || 'guest'}`,
        ipAddr
      })

      return paymentUrl
    } catch (err) {
      if (!t.finished) await t.rollback()
      throw err
    }
  }

  async checkPayment(query) {
    const result = verifyResponse(query)
    const { data, valid } = result
    if (!valid) return result
    const donationId = data.vnp_TxnRef
    const campaignId = data.vnp_OrderInfo.split('_')[3]
    const userIdString = data.vnp_OrderInfo.split('_')[7]
    const userId = userIdString === 'guest' ? null : +userIdString
    const donationRow = await db.Donation.findOne({ where: { donationId } })
    const donation = donationRow?.get()

    if (!donation) {
      throw new AppError(DONATION_MESSAGES.DONATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (donation.statusId === donationStatus.Completed) {
      throw new AppError(DONATION_MESSAGES.ALREADY_PROCESS, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
    const campaignRow = await db.Campaign.findOne({
      where: { campaignId },
      include: [{ model: db.Organization, as: 'organization' }]
    })
    const campaign = campaignRow.get()
    const creatorId = campaign?.organization ? campaign.organization.get()?.createdBy : null
    if (data.vnp_ResponseCode === '00') {
      const transaction = await db.sequelize.transaction()
      try {
        await db.Donation.update({ statusId: donationStatus.Completed }, { where: { donationId }, transaction })
        await db.Campaign.increment({ currentAmount: data.vnp_Amount / 100 }, { where: { campaignId }, transaction })
        const walletRow = await db.Wallet.findOne({
          where: { walletTypeId: walletType.Campaign, campaignId }
        })
        const wallet = walletRow.get()
        await db.Wallet.increment(
          {
            balance: data.vnp_Amount / 100,
            receiveAmount: data.vnp_Amount / 100
          },
          {
            where: { walletTypeId: walletType.Campaign, campaignId },
            transaction
          }
        )
        await db.Transaction.create(
          {
            donationId,
            walletId: wallet.walletId,
            walletTypeId: walletType.Campaign,
            amount: data.vnp_Amount / 100,
            transactionTime: new Date(),
            typeId: transactionType.Inflow,
            statusId: transactionStatus.Completed
          },
          { transaction }
        )

        const adminRow = await db.User.findOne({
          where: { firstName: 'Admin', lastName: 'Admin' }
        })
        const admin = adminRow.get()
        const notifications = [
          {
            userId: admin.userId,
            title: 'Thông báo quyên góp',
            content: `Một khoản quyên góp trị giá ${data.vnp_Amount / 100} VND vừa được thực hiện.`,
            relatedDonationId: donationId,
            relatedCampaignId: campaignId
          }
        ]
        if (creatorId && creatorId !== userId && creatorId !== admin.userId) {
          notifications.push({
            userId: creatorId,
            title: 'Chiến dịch của bạn vừa nhận được quyên góp',
            content: `Chiến dịch #${campaignId} của bạn vừa nhận được khoản quyên góp trị giá ${data.vnp_Amount / 100} VND.`,
            relatedDonationId: donationId,
            relatedCampaignId: campaignId
          })
        }
        if (userId) {
          notifications.push({
            userId,
            title: 'Quyên góp thành công',
            content: `Bạn đã quyên góp cho chiến dịch #${campaignId} thành công.`,
            relatedDonationId: donationId,
            relatedCampaignId: campaignId
          })
        }

        const createdNotifications = await db.Notification.bulkCreate(notifications, {
          transaction,
          returning: true
        })
        const io = getIO()
        createdNotifications.forEach((notifRow) => {
          const notif = notifRow.get()
          io.to(String(notif.userId)).emit('notification', notif)
        })
        await transaction.commit()
      } catch (err) {
        await transaction.rollback()
        throw err
      }
    }
    return result
  }
}
module.exports = new PaymentServices()
