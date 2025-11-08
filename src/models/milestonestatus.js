'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MilestoneStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MilestoneStatus.hasMany(models.Milestone, { foreignKey: 'milestoneStatusId' })
    }
  }
  MilestoneStatus.init(
    {
      milestoneStatusId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      milestoneStatusName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'MilestoneStatus'
    }
  )
  return MilestoneStatus
}
