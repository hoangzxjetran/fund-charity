'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class DonationStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DonationStatus.hasMany(models.Donation, { foreignKey: 'statusId', as: 'donations' })
    }
  }
  DonationStatus.init(
    {
      donationStatusId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      statusName: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'DonationStatus'
    }
  )
  return DonationStatus
}
