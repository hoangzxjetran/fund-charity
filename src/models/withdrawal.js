'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdrawal.belongsTo(models.Campaign, {
        foreignKey: 'campaignId',
        as: 'campaign'
      })

      // From Wallet
      Withdrawal.belongsTo(models.Wallet, {
        foreignKey: 'fromWalletId',
        as: 'fromWallet'
      })

      // To Wallet
      Withdrawal.belongsTo(models.Wallet, {
        foreignKey: 'toWalletId',
        as: 'toWallet'
      })

      // Requested By User
      Withdrawal.belongsTo(models.User, {
        foreignKey: 'requestedBy',
        as: 'requester'
      })
      // Approved By User
      Withdrawal.belongsTo(models.User, {
        foreignKey: 'approvedBy',
        as: 'approver'
      })

      // Withdrawal Status
      Withdrawal.belongsTo(models.WithdrawalStatus, {
        foreignKey: 'statusId',
        as: 'status'
      })

      // Notification liên quan
      Withdrawal.hasMany(models.Notification, {
        foreignKey: 'relatedWithdrawalId',
        as: 'notifications'
      })
    }
  }
  Withdrawal.init(
    {
      withdrawalId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      campaignId: DataTypes.INTEGER,
      fromWalletId: DataTypes.INTEGER,
      toWalletId: DataTypes.INTEGER,
      requestedBy: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(18, 2),
      purpose: DataTypes.STRING,
      reasonRejected: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      requestedAt: DataTypes.DATE,
      approvedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Withdrawal'
    }
  )
  return Withdrawal
}
