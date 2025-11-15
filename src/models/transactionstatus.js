'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TransactionStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionStatus.hasMany(models.Transaction, { foreignKey: 'statusId', as: 'transactions' })
    }
  }
  TransactionStatus.init(
    {
      transactionStatusId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      statusName: { type: DataTypes.STRING(30) }
    },
    {
      sequelize,
      modelName: 'TransactionStatus'
    }
  )
  return TransactionStatus
}
