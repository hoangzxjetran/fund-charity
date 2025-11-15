'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Campaign.belongsTo(models.Organization, { foreignKey: 'orgId', as: 'organization' })
      Campaign.belongsTo(models.CategoryFundraising, { foreignKey: 'categoryId', as: 'category' })
      Campaign.belongsTo(models.CampaignStatus, { foreignKey: 'statusId', as: 'status' })
      Campaign.hasMany(models.CampaignMedia, { foreignKey: 'campaignId', as: 'media' })
      Campaign.hasMany(models.Donation, { foreignKey: 'campaignId', as: 'donations' })
      Campaign.hasMany(models.VolunteerRegistration, { foreignKey: 'campaignId', as: 'volunteers' })
      Campaign.hasMany(models.Withdrawal, { foreignKey: 'campaignId', as: 'withdrawals' })
    }
  }
  Campaign.init(
    {
      campaignId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: DataTypes.INTEGER, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(255) },
      description: { type: DataTypes.TEXT },
      startDate: { type: DataTypes.DATE },
      endDate: { type: DataTypes.DATE },
      targetAmount: { type: DataTypes.DECIMAL(18, 2) },
      currentAmount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      statusId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      sequelize,
      modelName: 'Campaign'
    }
  )
  return Campaign
}
