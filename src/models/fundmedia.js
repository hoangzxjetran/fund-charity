'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FundMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FundMedia.belongsTo(models.Fund, { foreignKey: 'fundId' })
      FundMedia.belongsTo(models.Media, { foreignKey: 'mediaType' })
    }
  }
  FundMedia.init(
    {
      fundMediaId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fundId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Fund', key: 'fundId' } },
      url: DataTypes.STRING,
      mediaType: {
        type: DataTypes.INTEGER,
        references: { model: 'Media', key: 'mediaType' }
      }
    },
    {
      sequelize,
      modelName: 'FundMedia'
    }
  )
  return FundMedia
}
