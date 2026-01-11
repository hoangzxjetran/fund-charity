'use strict'
const { Model } = require('sequelize')
const { friendRequestStatus } = require('../constants/enum')
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.FriendRequest.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      models.FriendRequest.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
    }
  }
  FriendRequest.init(
    {
      friendRequestId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: Object.values(friendRequestStatus),
        defaultValue: friendRequestStatus.Pending
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
      modelName: 'FriendRequest'
    }
  )
  return FriendRequest
}
