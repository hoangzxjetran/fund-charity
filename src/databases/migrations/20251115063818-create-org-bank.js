'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrgBanks', {
      bankAccountId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Organizations', key: 'orgId' } },
      bankName: { type: Sequelize.STRING(255) },
      accountNumber: { type: Sequelize.STRING(50) },
      accountHolder: { type: Sequelize.STRING(255) },
      branch: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrgBanks')
  }
}
