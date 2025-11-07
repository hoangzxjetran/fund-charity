'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Donation, { foreignKey: 'donationId' });
    }
  }
  Transaction.init({
    transactionId: DataTypes.INTEGER,
    donationId:{
      type: DataTypes.INTEGER,
      references: { model: 'Donation', key: 'donationId' }
    },
    bankName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    accountName: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    transactionTime: DataTypes.DATE,
    proofImage: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};