const db = require('../models')
class TransactionServices {
  async getTransactions({ page, limit, walletId, type, search, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = page ? parseInt(page) : 1
    limit = limit ? parseInt(limit) : 10
    const offset = (page - 1) * limit
    const whereClause = {}
    if (walletId) {
      whereClause.walletId = walletId
    }
    if (type) {
      if (type === 'donation') {
        whereClause.donationId = { [db.Sequelize.Op.ne]: null }
      } else if (type === 'withdrawal') {
        whereClause.withdrawalId = { [db.Sequelize.Op.ne]: null }
      }
    }
    const { rows, count } = await db.Transaction.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['typeId', 'statusId']
      },
      include: [
        { model: db.TransactionType, as: 'type', attributes: ['transactionTypeId', 'typeName'] },
        { model: db.TransactionStatus, as: 'status', attributes: ['transactionStatusId', 'statusName'] }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset
    })

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit
      }
    }
  }
}

module.exports = new TransactionServices()
