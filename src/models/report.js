'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init(
    {
      reportId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        }
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ['campaign', 'user', 'withdrawal']
      },
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ReportReasons',
          key: 'reasonId'
        }
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        enum: ['pending', 'reviewed', 'rejected']
      }
    },
    {
      sequelize,
      modelName: 'Report'
    }
  )
  return Report
}
