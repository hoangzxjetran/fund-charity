'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'Conversation' });
      models.Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      models.Message.hasMany(models.MessageMedia, { foreignKey: 'messageId', as: 'Media' });
    }
  }
  Message.init(
    {
      messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Conversations', key: 'conversationId' }
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      messageMediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'MessageMedias', key: 'messageMediaId' }
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
      modelName: 'Message'
    }
  )
  return Message
}
