'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Fund.belongsTo(models.FundraisingMethod, { foreignKey: 'methodId' })
      Fund.belongsTo(models.FundStatus, { foreignKey: 'status' })
      Fund.belongsTo(models.CategoryFund, { foreignKey: 'categoryFund' })
      Fund.belongsTo(models.User, { foreignKey: 'creatorId' })
      Fund.hasMany(models.FundMedia, { foreignKey: 'fundId' })
      Fund.hasMany(models.Donation, { foreignKey: 'fundId' })
      Fund.hasMany(models.CharityCampaign, { foreignKey: 'fundId' })
    }
  }
  Fund.init(
    {
      fundId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      methodId: {
        type: DataTypes.INTEGER,
        references: { model: 'FundraisingMethod', key: 'methodId' }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      creatorId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'userId' }
      },
      fundName: DataTypes.STRING,
      bannerUrl: DataTypes.STRING,
      description: DataTypes.TEXT,
      bankAccountNumber: DataTypes.STRING,
      bankName: DataTypes.STRING,
      urlQrCode: DataTypes.STRING,
      targetAmount: DataTypes.DOUBLE,
      currentAmount: DataTypes.DOUBLE,
      status: {
        type: DataTypes.INTEGER,
        references: { model: 'FundStatus', key: 'statusId' }
      },
      categoryFund: {
        type: DataTypes.INTEGER,
        references: { model: 'CategoryFund', key: 'categoryId' }
      }
    },
    {
      sequelize,
      modelName: 'Fund'
    }
  )
  return Fund
}
