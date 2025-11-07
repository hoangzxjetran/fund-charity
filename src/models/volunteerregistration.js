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
      VolunteerRegistration.belongsTo(models.User, { foreignKey: 'userId' })
      VolunteerRegistration.belongsTo(models.CharityCampaign, { foreignKey: 'campaignId' })
      VolunteerRegistration.belongsTo(models.VolunteerStatus, { foreignKey: 'status' })
    }
  }
  VolunteerRegistration.init(
    {
      registrationId: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'userId' }
      },
      campaignId: {
        type: DataTypes.INTEGER,
        references: { model: 'CharityCampaign', key: 'campaignId' }
      },
      registrationDate: DataTypes.DATE,

      status: {
        type: DataTypes.INTEGER,
        references: { model: 'VolunteerStatus', key: 'statusId' }
      }
    },
    {
      sequelize,
      modelName: 'VolunteerRegistration'
    }
  )
  return VolunteerRegistration
}
