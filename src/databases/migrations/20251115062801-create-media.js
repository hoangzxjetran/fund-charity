'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Media', {
      mediaTypeId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      mediaName: { type: Sequelize.STRING(50) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Media')
  }
}
