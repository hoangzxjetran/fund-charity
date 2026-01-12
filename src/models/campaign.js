'use strict'
const { Model } = require('sequelize')
const { walletType } = require('../constants/enum')
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
      Campaign.hasOne(models.Wallet, {
        foreignKey: 'ownerId',
        scope: { walletTypeId: walletType.Campaign },
        as: 'wallet'
      })
      Campaign.hasOne(models.OrgBank, { foreignKey: 'campaignId', as: 'bankDetails' })
      Campaign.hasMany(models.Report, { foreignKey: 'targetId', as: 'reports' })
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
      targetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        get() {
          const rawValue = this.getDataValue('targetAmount')
          return rawValue ? parseFloat(rawValue) : 0
        }
      },
      currentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
        get() {
          const rawValue = this.getDataValue('currentAmount')
          return rawValue ? parseFloat(rawValue) : 0
        }
      },
      statusId: { type: DataTypes.INTEGER, allowNull: false },
      lastReminderSentAt: { type: DataTypes.DATE, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Campaign'
    }
  )
  return Campaign
}
