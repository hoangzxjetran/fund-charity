'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Milestone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Milestone.belongsTo(models.MilestoneStatus, { foreignKey: 'milestoneStatusId' })
      Milestone.belongsTo(models.Fund, { foreignKey: 'fundId' })
      Milestone.hasMany(models.Donation, { foreignKey: 'milestoneId' }) 
    }
  }
  Milestone.init(
    {
      milestoneId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      targetAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      achievedAmount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      milestoneStatusId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'MilestoneStatuses',
          key: 'milestoneStatusId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fundId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Funds',
          key: 'fundId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    },
    {
      sequelize,
      modelName: 'Milestone'
    }
  )
  return Milestone
}
