'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrgMedia', {
      orgMediaId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Organizations', key: 'orgId' } },
      mediaTypeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Media', key: 'mediaTypeId' } },
      url: { type: Sequelize.STRING(255) },
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
    await queryInterface.dropTable('OrgMedia')
  }
}
