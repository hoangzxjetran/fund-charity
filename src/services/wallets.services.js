const HTTP_STATUS = require('../constants/httpStatus.js')
const { WALLET_MESSAGES } = require('../constants/message.js')
const { AppError } = require('../controllers/error.controllers.js')
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

  async getAllWallets({ page, limit, search, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = {}

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { '$owner.firstName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$owner.lastName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$owner.email$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$campaign.title$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$campaign.bankDetails.bankName$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$campaign.bankDetails.accountHolder$': { [db.Sequelize.Op.like]: `%${search}%` } },
        { '$campaign.bankDetails.branch$': { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }
    const { rows: wallets, count } = await db.Wallet.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
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
      ],
      distinct: true,
      col: 'walletId'
    })

    return {
      data: wallets.map((w) => {
        const data = w.toJSON()
        data.bankDetails = data?.campaign?.bankDetails || null
        delete data?.campaign?.bankDetails

        return data
      }),
      pagination: {
        page,
        limit,
        total: count
      }
    }
  }

  async getWalletById(walletId) {
    const wallet = await db.Wallet.findByPk(walletId, {
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
    if (!wallet) {
      throw new AppError(WALLET_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    const data = wallet.toJSON()
    data.bankDetails = data?.campaign?.bankDetails || null
    delete data?.campaign?.bankDetails

    return data
  }
}

module.exports = new WalletServices()
