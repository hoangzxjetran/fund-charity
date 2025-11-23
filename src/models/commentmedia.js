'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CommentMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentMedia.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        as: 'comment'
      })
      CommentMedia.belongsTo(models.Media, {
        foreignKey: 'mediaTypeId',
        as: 'mediaType'
      })
    }
  }
  CommentMedia.init(
    {
      commentMediaId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mediaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Media',
          key: 'mediaTypeId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Comments',
          key: 'commentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'CommentMedia'
    }
  )
  return CommentMedia
}
