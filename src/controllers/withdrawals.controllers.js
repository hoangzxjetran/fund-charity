const HTTP_STATUS = require('../constants/httpStatus')
const withdrawalsServices = require('../services/withdrawals.services')

class WithdrawalControllers {
  async create(req, res, next) {
    const { userId } = req.user
    const { campaignId, fromWalletId, amount, purpose } = req.body
    const data = await withdrawalsServices.createWithdrawal({
      campaignId,
      fromWalletId,
      requestedBy: userId,
      amount,
      purpose
    })
    res.status(HTTP_STATUS.CREATED).json({ data })
  }
  async updateStatus(req, res, next) {
    try {
      const { withdrawalId } = req.params
      const { status } = req.body
      const updatedWithdrawal = await withdrawalsServices.updateWithdrawalStatus({ withdrawalId, status })
      res.status(200).json({ success: true, data: updatedWithdrawal })
    } catch (error) {
      next(error)
    }
  }
  async getAll(req, res, next) {
    try {
      const { page, limit, status, campaignId, sortBy, sortOrder } = req.query
      const withdrawals = await withdrawalsServices.getAllWithdrawals({
        page,
        limit,
        status,
        campaignId,
        sortBy,
        sortOrder
      })
      res.status(200).json({ success: true, data: withdrawals })
    } catch (error) {}
  }
}

module.exports = new WithdrawalControllers()
