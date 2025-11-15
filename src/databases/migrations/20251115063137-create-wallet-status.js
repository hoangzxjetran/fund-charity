'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletStatuses', {
      walletStatusId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      statusName: { type: Sequelize.STRING(30) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WalletStatuses')
  }
}
