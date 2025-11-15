'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CategoryFundraising extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryFundraising.hasMany(models.Campaign, { foreignKey: 'categoryId', as: 'campaigns' })
    }
  }
  CategoryFundraising.init(
    {
      categoryId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      categoryName: { type: DataTypes.STRING(100) },
      logoIcon: {
        type: DataTypes.STRING(255)
      }
    },
    {
      sequelize,
      modelName: 'CategoryFundraising'
    }
  )
  return CategoryFundraising
}
