const HTTP_STATUS = require('../constants/httpStatus')
const walletsServices = require('../services/wallets.services')

class WalletControllers {
  async getWalletByUserId(req, res, next) {
    const { userId } = req.params
    const data = await walletsServices.getWalletByUserId(userId)
    return res.status(HTTP_STATUS.OK).json({ data })
  }

  async getAll(req, res, next) {
    const data = await walletsServices.getAllWallets()
    return res.status(HTTP_STATUS.OK).json({ data })
  }
}

module.exports = new WalletControllers()
