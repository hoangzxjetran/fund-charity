'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Withdrawals', {
      withdrawalId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      campaignId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Campaigns', key: 'campaignId' } },
      fromWalletId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Wallets', key: 'walletId' } },
      toWalletId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Wallets', key: 'walletId' } },
      toBankAccountId: { type: Sequelize.INTEGER, references: { model: 'OrgBanks', key: 'bankAccountId' } },
      requestedBy: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'userId' } },
      approvedBy: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'userId' } },
      amount: { type: Sequelize.DECIMAL(18, 2) },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'WithdrawalStatuses', key: 'withdrawalStatusId' }
      },
      requestedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      approvedAt: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('Withdrawals')
  }
}
