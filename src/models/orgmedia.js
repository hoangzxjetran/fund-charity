'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrgMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrgMedia.belongsTo(models.Organization, { foreignKey: 'orgId', as: 'organization' })
      OrgMedia.belongsTo(models.Media, { foreignKey: 'mediaTypeId', as: 'mediaType' })
    }
  }
  OrgMedia.init(
    {
      orgMediaId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: DataTypes.INTEGER, allowNull: false },
      mediaTypeId: { type: DataTypes.INTEGER, allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false }
    },
    {
      sequelize,
      modelName: 'OrgMedia'
    }
  )
  return OrgMedia
}
