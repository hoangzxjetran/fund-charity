'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, { foreignKey: 'userId' })
      Notification.belongsTo(models.Donation, { foreignKey: 'donationId' })
    }
  }
  Notification.init(
    {
      notificationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'User', key: 'userId' } },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      type: DataTypes.STRING,
      isRead: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      donationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Donation', key: 'donationId' }
      }
    },
    {
      sequelize,
      modelName: 'Notification'
    }
  )
  return Notification
}
