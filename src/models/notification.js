'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      // Donation
      Notification.belongsTo(models.Donation, {
        foreignKey: 'relatedDonationId',
        as: 'donation'
      })

      // Withdrawal
      Notification.belongsTo(models.Withdrawal, {
        foreignKey: 'relatedWithdrawalId',
        as: 'withdrawal'
      })

      // Campaign
      Notification.belongsTo(models.Campaign, {
        foreignKey: 'relatedCampaignId',
        as: 'campaign'
      })
    }
  }
  Notification.init(
    {
      notificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      content: {
        type: DataTypes.STRING(500)
      },
      type: {
        type: DataTypes.STRING(50)
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      relatedDonationId: {
        type: DataTypes.INTEGER
      },
      relatedWithdrawalId: {
        type: DataTypes.INTEGER
      },
      relatedCampaignId: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Notification'
    }
  )
  return Notification
}
