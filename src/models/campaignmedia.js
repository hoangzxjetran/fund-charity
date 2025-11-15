'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CampaignMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CampaignMedia.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' })
      CampaignMedia.belongsTo(models.Media, { foreignKey: 'mediaTypeId', as: 'mediaType' })
    }
  }
  CampaignMedia.init(
    {
      campaignMediaId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      campaignId: { type: DataTypes.INTEGER, allowNull: false },
      mediaTypeId: { type: DataTypes.INTEGER, allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.STRING(255) }
    },
    {
      sequelize,
      modelName: 'CampaignMedia'
    }
  )
  return CampaignMedia
}
