'use strict'
const { Model } = require('sequelize')
const { walletType } = require('../constants/enum')
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Organization.hasMany(models.OrgBank, { foreignKey: 'orgId', as: 'banks' })
      Organization.hasMany(models.Campaign, { foreignKey: 'orgId', as: 'campaigns' })
      Organization.hasMany(models.UserRole, { foreignKey: 'orgId', as: 'userRoles' })
      Organization.hasMany(models.OrgMedia, { foreignKey: 'orgId', as: 'media' })
      Organization.hasMany(models.Wallet, {
        foreignKey: 'ownerId',
        scope: { walletTypeId: walletType.Admin },
        as: 'wallets'
      })
      Organization.belongsTo(models.OrgStatus, {
        foreignKey: 'statusId',
        as: 'status'
      })
    }
  }
  Organization.init(
    {
      orgId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orgName: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255) },
      phoneNumber: { type: DataTypes.STRING(50) },
      address: { type: DataTypes.TEXT },
      description: { type: DataTypes.TEXT },
      website: { type: DataTypes.STRING(255) },
      avatar: { type: DataTypes.STRING(255) },
      statusId: { type: DataTypes.INTEGER, allowNull: false },
      createdBy: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      sequelize,
      modelName: 'Organization'
    }
  )
  return Organization
}
