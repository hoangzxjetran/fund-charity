'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TransactionType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionType.hasMany(models.Transaction, { foreignKey: 'typeId', as: 'transactions' })
    }
  }
  TransactionType.init(
    {
      transactionTypeId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      typeName: { type: DataTypes.STRING(30) }
    },
    {
      sequelize,
      modelName: 'TransactionType'
    }
  )
  return TransactionType
}
