const db = require('../models/index.js')
class WalletServices {
  async getWalletByUserId(userId) {
    const wallets = await db.Wallet.findAll({
      where: { ownerId: userId },
      attributes: ['walletId', 'balance', 'receiveAmount'],
      include: [
        { model: db.WalletStatus, as: 'status' },
        { model: db.WalletType, as: 'type' },
        { model: db.User, as: 'owner', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        {
          model: db.Campaign,
          as: 'campaign',
          attributes: ['title', 'campaignId'],
          include: [
            {
              model: db.OrgBank,
              as: 'bankDetails',
              attributes: ['bankAccountId', 'orgId', 'bankName', 'accountNumber', 'accountHolder', 'branch']
            }
          ]
        }
      ]
    })
    return wallets.map((w) => {
      const data = w.toJSON()
      data.bankDetails = data?.campaign?.bankDetails || null
      delete data?.campaign?.bankDetails

      return data
    })
  }

  async getAllWallets() {
    const wallets = await db.Wallet.findAll({
      attributes: ['walletId', 'balance', 'receiveAmount'],
      include: [
        { model: db.WalletStatus, as: 'status' },
        { model: db.WalletType, as: 'type' },
        { model: db.User, as: 'owner', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        {
          model: db.Campaign,
          as: 'campaign',
          attributes: ['title', 'campaignId'],
          include: [
            {
              model: db.OrgBank,
              as: 'bankDetails',
              attributes: ['bankAccountId', 'orgId', 'bankName', 'accountNumber', 'accountHolder', 'branch']
            }
          ]
        }
      ]
    })
    return wallets.map((w) => {
      const data = w.toJSON()
      data.bankDetails = data?.campaign?.bankDetails || null
      delete data?.campaign?.bankDetails

      return data
    })
  }
}

module.exports = new WalletServices()
