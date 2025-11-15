'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      walletId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      ownerType: { type: Sequelize.STRING(50), allowNull: false },
      ownerId: { type: Sequelize.INTEGER, allowNull: false },
      balance: { type: Sequelize.DECIMAL(18, 2), defaultValue: 0 },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'WalletStatuses', key: 'walletStatusId' }
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wallets')
  }
}
