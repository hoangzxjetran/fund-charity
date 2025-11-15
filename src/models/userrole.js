'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRole.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      UserRole.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' })
      UserRole.belongsTo(models.Organization, { foreignKey: 'orgId', as: 'organization' })
    }
  }
  UserRole.init(
    {
      userRoleId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      orgId: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
      sequelize,
      modelName: 'UserRole'
    }
  )
  return UserRole
}
