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
        orderInfo: `Ung_ho_camp_${campaignId}_donation_${response.donationId}`,
        ipAddr
      })

      return paymentUrl
    } catch (err) {
      if (!t.finished) await t.rollback()
      throw err
    }
  }

  async checkPayment(query, userId = null) {
    const result = verifyResponse(query)
    const { data, valid } = result

    if (!valid) return result
    const donationId = data.vnp_TxnRef
    const campaignId = data.vnp_OrderInfo.split('_')[3]
    const donationData = await db.Donation.findOne({ where: { donationId } })
    const donation = donationData ? donationData.dataValues : null
    if (!donation) {
      throw new AppError(DONATION_MESSAGES.DONATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (donation.statusId === donationStatus.Completed) {
      throw new AppError(DONATION_MESSAGES.ALREADY_PROCESS, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
    if (data.vnp_ResponseCode === '00') {
      const transaction = await db.sequelize.transaction()
      try {
        await db.Donation.update(
          { statusId: donationStatus.Completed },
          { where: { donationId, campaignId }, transaction }
        )
        await db.Campaign.increment(
          { currentAmount: data.vnp_Amount / 100 },
          { where: { campaignId }, transaction, Lock: transaction.LOCK.UPDATE }
        )
        const walletData = await db.Wallet.findOne({
          where: { walletTypeId: walletType.Campaign, ownerId: campaignId },
          transaction,
          Lock: transaction.LOCK.UPDATE
        })
        await db.Wallet.increment(
          { balance: data.vnp_Amount / 100, receiveAmount: data.vnp_Amount / 100 },
          {
            where: { walletTypeId: walletType.Campaign, ownerId: campaignId },
            transaction,
            Lock: transaction.LOCK.UPDATE
          }
        )
        const walletCampaign = walletData.dataValues
        await db.Transaction.create(
          {
            donationId,
            walletId: walletCampaign.walletId,
            walletTypeId: walletType.Campaign,
            amount: data.vnp_Amount / 100,
            transactionTime: new Date(),
            typeId: transactionType.Inflow,
            statusId: transactionStatus.Completed
          },
          { transaction }
        )

        const resultAdmin = await db.User.findOne({ where: { firstName: 'Admin', lastName: 'Admin' } })
        const admin = resultAdmin.dataValues
        const notifications = [
          {
            userId: admin.userId,
            title: 'Thông báo quyên góp',
            content: `Một khoản quyên góp mới trị giá ${data.vnp_Amount / 100} VND đã được thực hiện.`
          }
        ]
        if (userId) {
          notifications.push({
            userId,
            title: 'Quyên góp thành công',
            content: `Bạn đã quyên góp cho chiến dịch ID: ${campaignId} thành công. Cảm ơn bạn!`
          })
        }
        const createdNotifications = await db.Notification.bulkCreate(notifications, { transaction })
        const io = getIO()
        createdNotifications.forEach((notif) => {
          if (notif.userId) {
            io.to(String(notif.userId)).emit('notification', notif)
          } else {
            io.to('admin_room').emit('notification', notif)
          }
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
