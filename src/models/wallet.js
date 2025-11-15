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
    }
  }
  Wallet.init(
    {
      walletId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      ownerType: { type: DataTypes.STRING(50), allowNull: false },
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      balance: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      statusId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      sequelize,
      modelName: 'Wallet'
    }
  )
  return Wallet
}
