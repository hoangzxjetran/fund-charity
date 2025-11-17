'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrgStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrgStatus.hasMany(models.Organization, {
        foreignKey: 'statusId',
        as: 'organizations'
      })
    }
  }
  OrgStatus.init(
    {
      orgStatusId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      orgStatusName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'OrgStatus'
    }
  )
  return OrgStatus
}
