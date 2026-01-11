'use strict'
const { Model } = require('sequelize')
const { conversationType } = require('../constants/enum')
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Conversation.hasMany(models.ConversationMember, { foreignKey: 'conversationId', as: 'Members' });
      models.Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'Messages' });
    }
  }
  Conversation.init(
    {
      conversationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: Object.values(conversationType),
        defaultValue: conversationType.Private
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: 'Conversation'
    }
  )
  return Conversation
}
