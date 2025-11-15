'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bank.hasMany(models.OrgBank, { foreignKey: 'bankId', as: 'orgBanks' })
      Bank.hasMany(models.Transaction, { foreignKey: 'bankId', as: 'transactions' })
    }
  }
  Bank.init(
    {
      bankId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      bankName: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Bank'
    }
  )
  return Bank
}
