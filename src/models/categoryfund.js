'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CategoryFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CategoryFund.hasMany(models.Fund, { foreignKey: 'categoryFund' })
    }
  }
  CategoryFund.init(
    {
      categoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryName: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'CategoryFund'
    }
  )
  return CategoryFund
}
