const HTTP_STATUS = require('../constants/httpStatus')
const transactionsServices = require('../services/transactions.services')

class TransactionControllers {
  async getTransactions(req, res) {
    const { page, limit, search, type, sortBy, sortOrder, walletId } = req.query
    const result = await transactionsServices.getTransactions({
      page,
      limit,
      search,
      sortBy,
      walletId,
      sortOrder,
      type
    })
    return res.status(HTTP_STATUS.OK).json({
      ...result
    })
  }
}
module.exports = new TransactionControllers()
