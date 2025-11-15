'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WithdrawalStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WithdrawalStatus.hasMany(models.Withdrawal, {
        foreignKey: 'statusId',
        as: 'withdrawals'
      })
    }
  }
  WithdrawalStatus.init(
    {
      withdrawalStatusId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      statusName: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'WithdrawalStatus'
    }
  )
  return WithdrawalStatus
}
