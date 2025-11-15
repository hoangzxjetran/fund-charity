'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WalletStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WalletStatus.hasMany(models.Wallet, { foreignKey: 'statusId', as: 'wallets' })
    }
  }
  WalletStatus.init(
    {
      walletStatusId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      statusName: { type: DataTypes.STRING(30) }
    },
    {
      sequelize,
      modelName: 'WalletStatus'
    }
  )
  return WalletStatus
}
