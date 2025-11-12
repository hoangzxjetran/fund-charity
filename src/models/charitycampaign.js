'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CharityCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CharityCampaign.belongsTo(models.Fund, { foreignKey: 'fundId' })
      CharityCampaign.hasMany(models.VolunteerRegistration, { foreignKey: 'campaignId' })
    }
  }
  CharityCampaign.init(
    {
      campaignId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      fundId: {
        type: DataTypes.INTEGER,
        references: { model: 'Fund', key: 'fundId' }
      },
      campaignName: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      location: DataTypes.STRING,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'CharityCampaign'
    }
  )
  return CharityCampaign
}
