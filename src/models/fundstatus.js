'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FundStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FundStatus.hasMany(models.Fund, { foreignKey: 'status' })
    }
  }
  FundStatus.init(
    {
      statusId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      statusName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'FundStatus'
    }
  )
  return FundStatus
}
