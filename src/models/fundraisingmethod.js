'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FundraisingMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FundraisingMethod.hasMany(models.Fund, { foreignKey: 'methodId' })
    }
  }
  FundraisingMethod.init(
    {
      methodId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      methodName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'FundraisingMethod'
    }
  )
  return FundraisingMethod
}
