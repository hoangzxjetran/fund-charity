'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Donation, { foreignKey: 'donationId', as: 'donation' })
      Transaction.belongsTo(models.Wallet, { foreignKey: 'walletId', as: 'wallet' })
      Transaction.belongsTo(models.TransactionType, { foreignKey: 'typeId', as: 'type' })
      Transaction.belongsTo(models.TransactionStatus, { foreignKey: 'statusId', as: 'status' })
    }
  }
  Transaction.init(
    {
      transactionId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      donationId: { type: DataTypes.INTEGER },
      withdrawalId: { type: DataTypes.INTEGER },
      walletId: { type: DataTypes.INTEGER, allowNull: false },
      balanceBefore: { type: DataTypes.DECIMAL(18, 2) },
      balanceAfter: { type: DataTypes.DECIMAL(18, 2) },
      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
      transactionTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      typeId: { type: DataTypes.INTEGER, allowNull: false },
      statusId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Transaction'
    }
  )
  return Transaction
}
