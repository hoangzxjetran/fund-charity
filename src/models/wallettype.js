'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WalletType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WalletType.hasMany(models.Wallet, { foreignKey: 'walletTypeId', as: 'wallets' })
    }
  }
  WalletType.init(
    {
      walletTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      walletTypeName: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'WalletType'
    }
  )
  return WalletType
}
