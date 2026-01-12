'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Friend.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      models.Friend.belongsTo(models.User, { foreignKey: 'friendId' })
    }
  }
  Friend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Friend'
    }
  )
  return Friend
}
