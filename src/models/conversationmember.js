'use strict'
const { Model } = require('sequelize')
const { conversationRole } = require('../constants/enum')
module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ConversationMember.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation'
      })

      models.ConversationMember.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  ConversationMember.init(
    {
      conversationMemberId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Conversations', key: 'conversationId' }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: Object.values(conversationRole),
        defaultValue: conversationRole.Member
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
      modelName: 'ConversationMember'
    }
  )
  return ConversationMember
}
