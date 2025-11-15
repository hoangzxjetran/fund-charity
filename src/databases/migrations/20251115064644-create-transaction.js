'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      transactionId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      donationId: { type: Sequelize.INTEGER, references: { model: 'Donations', key: 'donationId' } },
      walletId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Wallets', key: 'walletId' } },
      bankId: { type: Sequelize.INTEGER, references: { model: 'Banks', key: 'bankId' } },
      accountNumber: { type: Sequelize.STRING(50) },
      accountHolder: { type: Sequelize.STRING(255) },
      amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
      transactionTime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      proofImage: { type: Sequelize.STRING(255) },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'TransactionTypes', key: 'transactionTypeId' }
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'TransactionStatuses', key: 'transactionStatusId' }
      },
      bankRef: { type: Sequelize.STRING(100) },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions')
  }
}
