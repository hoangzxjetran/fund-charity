'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrgBank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrgBank.belongsTo(models.Organization, { foreignKey: 'orgId', as: 'organization' })
      OrgBank.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' })
    }
  }
  OrgBank.init(
    {
      bankAccountId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: DataTypes.INTEGER, allowNull: true },
      bankName: { type: DataTypes.STRING(255) },
      accountNumber: { type: DataTypes.STRING(50) },
      accountHolder: { type: DataTypes.STRING(255) },
      branch: { type: DataTypes.STRING(255) },
      campaignId: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
      sequelize,
      modelName: 'OrgBank'
    }
  )
  return OrgBank
}
