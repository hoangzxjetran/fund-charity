'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Organizations', {
      orgId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orgName: { type: Sequelize.STRING(255) },
      email: { type: Sequelize.STRING(255) },
      phoneNumber: { type: Sequelize.STRING(50) },
      address: { type: Sequelize.TEXT },
      description: { type: Sequelize.TEXT },
      website: { type: Sequelize.STRING(255) },
      avatar: { type: Sequelize.STRING(255) },
      statusId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'OrgStatuses', key: 'orgStatusId' } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Organizations')
  }
}
