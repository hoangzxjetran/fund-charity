'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CampaignStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CampaignStatus.hasMany(models.Campaign, { foreignKey: 'statusId', as: 'campaigns' })
    }
  }
  CampaignStatus.init(
    {
      campaignStatusId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      statusName: { type: DataTypes.STRING(50) }
    },
    {
      sequelize,
      modelName: 'CampaignStatus'
    }
  )
  return CampaignStatus
}
