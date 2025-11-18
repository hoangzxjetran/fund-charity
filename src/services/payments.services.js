const { donationStatus, walletType, transactionType, transactionStatus } = require('../constants/enum')
const db = require('../models')
const { getIO } = require('../utils/socket')
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
          paymentStatus: 'Pending',
          isAnonymous: isAnonymous,
          email,
          address,
          phoneNumber,
          message,
          donateDate: new Date()
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

    if (data.vnp_ResponseCode === '00') {
      const transaction = await db.sequelize.transaction()
      try {
        const donationId = data.vnp_TxnRef
        const campaignId = data.vnp_OrderInfo.split('_')[3]
        const updatedCampaign = await db.Campaign.findByPk(campaignId, { transaction })
        const creatorId = updatedCampaign.creatorId
        await db.Donation.update({ paymentStatus: donationStatus.Success }, { where: { donationId }, transaction })
        const result = await db.Campaign.findByPk(campaignId, {
          include: [
            {
              model: db.Organization,
              as: 'organization'
            }
          ]
        })
        const campaign = result.dataValues
        await db.Campaign.increment(
          { currentAmount: data.vnp_Amount / 100 },
          { where: { campaignId }, transaction, Lock: transaction.LOCK.UPDATE }
        )

        // await db.Wallet.increment(
        //   { balance: data.vnp_Amount / 100 },
        //   { where: { ownerType: 'Admin' }, transaction, Lock: transaction.LOCK.UPDATE }
        // )
        // const orgWallet = await db.Wallet.findOne({
        //   where: { ownerType: 'Organization', ownerId: campaign.organization.orgId },
        //   transaction
        // })

        // await db.Transaction.create(
        //   {
        //     donationId,
        //     walletId: orgWallet.walletId,
        //     walletType: 'Organization',
        //     ownerId: campaign.organization.orgId,
        //     amount: data.vnp_Amount / 100,
        //     transactionTime: new Date(),
        //     typeId: transactionType.Inflow,
        //     statusId: 2
        //   },
        //   { transaction }
        // )

        // const resultAdmin = await db.User.findOne({ where: { firstName: 'Admin', lastName: 'Admin' } })
        // const admin = resultAdmin.dataValues
        // console.log(admin, creatorId)
        // const notifications = [
        //   // {
        //   //   userId: creatorId,
        //   //   title: 'Nhận được quyên góp mới',
        //   //   content: `Bạn đã nhận được một khoản quyên góp trị giá ${data.vnp_Amount / 100} VND cho chiến dịch của mình.`
        //   // },
        //   {
        //     userId: admin.userId,
        //     title: 'Thông báo quyên góp',
        //     content: `Một khoản quyên góp mới trị giá ${data.vnp_Amount / 100} VND đã được thực hiện.`
        //   }
        // ]
        // if (userId) {
        //   notifications.push({
        //     userId,
        //     title: 'Quyên góp thành công',
        //     content: `Bạn đã quyên góp cho chiến dịch ID: ${campaignId} thành công. Cảm ơn bạn!`
        //   })
        // }
        // const createdNotifications = await db.Notification.bulkCreate(notifications, { transaction })
        // const io = getIO()
        // createdNotifications.forEach((notif) => {
        //   if (notif.userId) {
        //     io.to(String(notif.userId)).emit('notification', notif)
        //   } else {
        //     io.to('admin_room').emit('notification', notif)
        //   }
        // })
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
