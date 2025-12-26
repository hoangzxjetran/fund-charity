'use strict'
const { Model } = require('sequelize')
const { walletType } = require('../constants/enum')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserRole, { foreignKey: 'userId', as: 'roles' })
      User.hasMany(models.Donation, { foreignKey: 'userId', as: 'donations' })
      User.hasMany(models.VolunteerRegistration, { foreignKey: 'userId', as: 'userInfo' })
      User.hasMany(models.Withdrawal, { foreignKey: 'requestedBy', as: 'requestedWithdrawals' })
      User.hasMany(models.Withdrawal, { foreignKey: 'approvedBy', as: 'approvedWithdrawals' })
      User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' })
      User.hasMany(models.Wallet, { foreignKey: 'ownerId', as: 'wallets' })
      User.hasMany(models.Organization, {
        foreignKey: 'createdBy',
        as: 'createdOrganizations'
      })
      User.hasMany(models.Report, { foreignKey: 'reporterId', as: 'reports' })
    }
  }
  User.init(
    {
      userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING(50) },
      lastName: { type: DataTypes.STRING(50) },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(100), allowNull: false },
      phoneNumber: { type: DataTypes.STRING(15) },
      avatar: { type: DataTypes.STRING(255) },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      refreshToken: { type: DataTypes.STRING(255) },
      accessTokenForgotPassword: { type: DataTypes.STRING(255) },
      isShowAsAnonymous: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  return User
}
