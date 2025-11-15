'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class VolunteerRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VolunteerRegistration.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      VolunteerRegistration.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' })
      VolunteerRegistration.belongsTo(models.VolunteerStatus, { foreignKey: 'statusId', as: 'status' })
    }
  }
  VolunteerRegistration.init(
    {
      registrationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      campaignId: { type: DataTypes.INTEGER, allowNull: false },
      statusId: { type: DataTypes.INTEGER, allowNull: false },
      registeredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      sequelize,
      modelName: 'VolunteerRegistration'
    }
  )
  return VolunteerRegistration
}
