'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MessageMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MessageMedia.belongsTo(models.Message, { foreignKey: 'messageId', as: 'message' })
      models.MessageMedia.belongsTo(models.Media, { foreignKey: 'mediaTypeId', as: 'mediaType' })
    }
  }
  MessageMedia.init(
    {
      messageMediaId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Messages', key: 'messageId' }
      },
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mediaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Media', key: 'mediaTypeId' }
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
      modelName: 'MessageMedia'
    }
  )
  return MessageMedia
}
