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
  async approved(req, res, next) {
    const { withdrawalId } = req.params
    const { userId: adminId } = req.user
    const approvedWithdrawal = await withdrawalsServices.approvedWithdrawal({ withdrawalId, adminId })
    res.status(HTTP_STATUS.OK).json({ data: approvedWithdrawal })
  }
  async rejected(req, res, next) {
    const { withdrawalId } = req.params
    const {reasonRejected}= req.body
    const { userId: adminId } = req.user
    const rejectedWithdrawal = await withdrawalsServices.rejectedWithdrawal({ withdrawalId, adminId, reasonRejected })
    res.status(HTTP_STATUS.OK).json({ data: rejectedWithdrawal })
  }

  async getAll(req, res, next) {
    const { page, limit, status, campaignId, sortBy, sortOrder } = req.query
    const data = await withdrawalsServices.getAllWithdrawals({
      page,
      limit,
      status,
      campaignId,
      sortBy,
      sortOrder
    })
    res.status(HTTP_STATUS.OK).json({ data })
  }
}

module.exports = new WithdrawalControllers()
