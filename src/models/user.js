'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'roleId' })
      User.hasMany(models.Donation, { foreignKey: 'userId' })
      User.hasMany(models.Fund, { foreignKey: 'creatorId' })
      User.hasMany(models.VolunteerRegistration, { foreignKey: 'userId' })
      User.hasMany(models.Notification, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      isActive: DataTypes.STRING,
      avatar: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      accessTokenForgotPassword: DataTypes.STRING,
      roleId: {
        type: DataTypes.INTEGER,
        references: { model: 'Role', key: 'roleId' }
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  return User
}
