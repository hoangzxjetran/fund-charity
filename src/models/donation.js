'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Donation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Donation.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' })
      Donation.hasMany(models.Transaction, { foreignKey: 'donationId', as: 'transactions' })
    }
  }
  Donation.init(
    {
      donationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      campaignId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
      paymentStatus: { type: DataTypes.STRING(50), defaultValue: 'pending' },
      donateDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      message: { type: DataTypes.STRING(255) }
    },
    {
      sequelize,
      modelName: 'Donation'
    }
  )
  return Donation
}
