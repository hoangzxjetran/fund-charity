const { withdrawalStatus, walletType, transactionType, transactionStatus } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { WALLET_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
const db = require('../models/index.js')
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
          message: purpose,
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
      console.log(error)
      if (!transaction.finished) {
        await transaction.rollback()
      }
      throw error
    }
  }

  async approveWithdrawal(withdrawalId, adminId) {
    const withdrawal = await db.Withdrawal.findByPk(withdrawalId)
    if (!withdrawal) {
      throw new Error('Withdrawal request not found')
    }
    if (withdrawal.status !== 'pending') {
      throw new Error('Only pending withdrawals can be approved')
    }

    withdrawal.status = 'approved'
    withdrawal.approvedBy = adminId
    withdrawal.approvedAt = new Date()
    await withdrawal.save()

    return withdrawal
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
      throw new Error('Withdrawal request not found')
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
