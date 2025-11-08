'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Donation.belongsTo(models.User, { foreignKey: 'userId' })
      Donation.belongsTo(models.Fund, { foreignKey: 'fundId' })
      Donation.hasOne(models.Transaction, { foreignKey: 'donationId' })
      Donation.hasMany(models.Notification, { foreignKey: 'donationId' })
      Donation.belongsTo(models.Milestone, { foreignKey: 'milestoneId' })
    }
  }
  Donation.init(
    {
      donationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'User', key: 'userId' } },
      fundId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Fund', key: 'fundId' } },
      amount: DataTypes.DOUBLE,
      paymentMethod: { type: DataTypes.STRING, allowNull: false },
      paymentStatus: DataTypes.STRING,
      transactionId: DataTypes.STRING,
      donateDate: DataTypes.DATE,
      message: DataTypes.STRING,
      milestoneId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Milestone', key: 'milestoneId' }
      }
    },
    {
      sequelize,
      modelName: 'Donation'
    }
  )
  return Donation
}
