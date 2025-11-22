'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.WalletStatus, { foreignKey: 'statusId', as: 'status' })
      Wallet.hasMany(models.Transaction, { foreignKey: 'walletId', as: 'transactions' })
      Wallet.belongsTo(models.WalletType, { foreignKey: 'walletTypeId', as: 'type' })
      Wallet.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' })
      Wallet.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' })
    }
  }
  Wallet.init(
    {
      walletId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      walletTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      balance: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      receiveAmount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      statusId: { type: DataTypes.INTEGER, allowNull: false },
      campaignId: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Wallet'
    }
  )
  return Wallet
}
