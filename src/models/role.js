'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.UserRole, { foreignKey: 'roleId', as: 'userRoles' })
    }
  }
  Role.init(
    {
      roleId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      roleName: { type: DataTypes.STRING(50) }
    },
    {
      sequelize,
      modelName: 'Role'
    }
  )
  return Role
}
