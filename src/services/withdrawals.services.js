const { withdrawalStatus, walletType, transactionType, transactionStatus } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { WALLET_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')
const { getIO } = require('../utils/socket.js')
const { sendWithdrawalApprovedEmail, sendNotifyWithdrawalToUser } = require('../utils/s3-ses.js')
class WithdrawalServices {
  async createWithdrawal({ campaignId, fromWalletId, requestedBy, amount, purpose }) {
    const transaction = await db.sequelize.transaction()
    try {
      if (Number(amount) <= 0) {
        throw new AppError('Invalid withdrawal amount', HTTP_STATUS.BAD_REQUEST)
      }

      const walletAdmin = await db.Wallet.findOne({
        where: { walletTypeId: walletType.Admin },
        transaction,
        lock: transaction.LOCK.UPDATE
      })

      if (!walletAdmin) {
        throw new AppError(WALLET_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }

      const walletRequester = await db.Wallet.findByPk(fromWalletId, {
        transaction,
        lock: transaction.LOCK.UPDATE
      })

      if (!walletRequester) {
        throw new AppError(WALLET_MESSAGES.WALLET_ID_INVALID, HTTP_STATUS.NOT_FOUND)
      }

      if (Number(walletRequester.balance) < Number(amount)) {
        throw new AppError(WALLET_MESSAGES.INSUFFICIENT_FUNDS, HTTP_STATUS.BAD_REQUEST)
      }

      const withdrawal = await db.Withdrawal.create(
        {
          campaignId,
          amount,
          fromWalletId,
          toWalletId: walletAdmin.walletId,
          requestedBy,
          approvedBy: null,
          statusId: withdrawalStatus.Pending,
          purpose,
          requestedAt: new Date()
        },
        { transaction }
      )
      await db.Transaction.create(
        {
          walletId: fromWalletId,
          walletTypeId: walletType.Campaign,
          amount,
          balanceBefore: walletRequester.balance,
          balanceAfter: walletRequester.balance - amount,
          withdrawalId: withdrawal.withdrawalId,
          typeId: transactionType.Outflow,
          statusId: transactionStatus.Pending,
          transactionTime: new Date()
        },
        { transaction }
      )
      await walletRequester.decrement('balance', { by: amount, transaction })
      await walletAdmin.increment('receiveAmount', { by: amount, transaction })

      await transaction.commit()

      return await db.Withdrawal.findByPk(withdrawal.withdrawalId, {
        attributes: {
          exclude: ['fromWalletId', 'toWalletId', 'requestedBy', 'approvedBy', 'statusId']
        },
        include: [
          { model: db.WithdrawalStatus, as: 'status' },
          { model: db.User, as: 'requester', attributes: ['userId', 'firstName', 'lastName', 'email'] },
          { model: db.User, as: 'approver', attributes: ['userId', 'firstName', 'lastName', 'email'] },
          { model: db.Wallet, as: 'fromWallet' },
          { model: db.Wallet, as: 'toWallet' }
        ]
      })
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
      throw error
    }
  }

  async approvedWithdrawal({ withdrawalId, adminId }) {
    const transaction = await db.sequelize.transaction()
    try {
      const withdrawal = await db.Withdrawal.findByPk(withdrawalId)
      if (!withdrawal) {
        throw new AppError(WALLET_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      if (withdrawal.statusId !== withdrawalStatus.Pending) {
        throw new AppError(WALLET_MESSAGES.STATUS_INVALID, HTTP_STATUS.BAD_REQUEST)
      }
      withdrawal.statusId = withdrawalStatus.Approved

      withdrawal.approvedBy = adminId
      withdrawal.approvedAt = new Date()
      const transactionRecord = await db.Transaction.findOne({
        where: { withdrawalId: withdrawal.withdrawalId },
        transaction
      })
      if (transactionRecord) {
        transactionRecord.statusId = transactionStatus.Completed
        await transactionRecord.save({ transaction })
      }
      await withdrawal.save()
      const emailRequester = await db.User.findByPk(withdrawal.requestedBy)
      if (emailRequester) {
        sendWithdrawalApprovedEmail({
          toAddress: emailRequester.email,
          userName: `${emailRequester.firstName} ${emailRequester.lastName}`,
          amount: withdrawal.amount,
          withdrawalId: withdrawal.withdrawalId
        })
      }
      const donations = await db.Donation.findOne({
        where: { campaignId: withdrawal.campaignId },
        order: [['createdAt', 'DESC']],
        transaction
      })
      if (donations) {
        for (const donation of donations) {
          sendNotifyWithdrawalToUser({
            toAddress: donation.donor.email,
            userName: `${donation.donor.firstName} ${donation.donor.lastName}`,
            fundName: donation.campaign.title,
            amount: withdrawal.amount,
            withdrawalId: withdrawal.withdrawalId,
            fundId: withdrawal.campaignId,
            purpose: withdrawal.purpose
          })
        }
      }
      await transaction.commit()
      return withdrawal
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
      throw error
    }
  }

  async rejectedWithdrawal({ withdrawalId, adminId, reasonRejected }) {
    const transaction = await db.sequelize.transaction()
    try {
      const withdrawal = await db.Withdrawal.findByPk(withdrawalId, { transaction })
      if (!withdrawal) {
        throw new AppError(WALLET_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }
      if (withdrawal.statusId !== withdrawalStatus.Pending) {
        throw new AppError(WALLET_MESSAGES.STATUS_INVALID, HTTP_STATUS.BAD_REQUEST)
      }
      withdrawal.statusId = withdrawalStatus.Rejected
      withdrawal.reasonRejected = reasonRejected
      const requesterId = withdrawal.requestedBy
      const notify = await db.Notification.create(
        {
          userId: requesterId,
          title: 'Rút tiền bị từ chối',
          content: 'Rút tiền của bạn đã bị từ chối sau quá trình xem xét.'
        },
        { transaction }
      )
      const io = getIO()
      io.to(String(requesterId)).emit('notification', notify)
      await withdrawal.save({ transaction })

      const walletRequester = await db.Wallet.findByPk(withdrawal.fromWalletId, {
        transaction,
        lock: transaction.LOCK.UPDATE
      })
      const walletAdmin = await db.Wallet.find(
        {
          where: { walletTypeId: walletType.Admin }
        },
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      )
      if (!walletRequester) {
        throw new AppError(WALLET_MESSAGES.WALLET_ID_INVALID, HTTP_STATUS.NOT_FOUND)
      }
      await walletRequester.increment('balance', { by: withdrawal.amount, transaction })
      await walletAdmin.decrement('receiveAmount', { by: withdrawal.amount, transaction })

      await transaction.commit()
      return true
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
      return false
    }
  }

  async getWithdrawalById(withdrawalId) {
    const withdrawal = await db.Withdrawal.findByPk(withdrawalId, {
      include: [
        { model: db.WithdrawalStatus, as: 'status' },
        { model: db.User, as: 'requester', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        { model: db.User, as: 'approver', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        { model: db.Wallet, as: 'fromWallet' },
        { model: db.Wallet, as: 'toWallet' }
      ]
    })
    if (!withdrawal) {
      throw new AppError(WALLET_MESSAGES.WITHDRAWAL_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return withdrawal
  }
  async getAllWithdrawals({ page, limit, status, campaignId, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = page ? parseInt(page) : 1
    limit = limit ? parseInt(limit) : 10
    const offset = (page - 1) * limit
    const whereClause = {}
    if (status) {
      whereClause.statusId = status
    }
    if (campaignId) {
      whereClause.campaignId = campaignId
    }

    const withdrawals = await db.Withdrawal.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.WithdrawalStatus, as: 'status' },
        { model: db.User, as: 'requester', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        { model: db.User, as: 'approver', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        { model: db.Wallet, as: 'fromWallet' },
        { model: db.Wallet, as: 'toWallet' }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset
    })
    return {
      data: withdrawals.rows,
      pagination: {
        total: withdrawals.count,
        page,
        limit
      }
    }
  }
}

module.exports = new WithdrawalServices()
