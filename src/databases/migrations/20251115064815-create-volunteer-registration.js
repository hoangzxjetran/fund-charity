'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VolunteerRegistrations', {
      registrationId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'userId' } },
      campaignId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Campaigns', key: 'campaignId' } },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'VolunteerStatuses', key: 'volunteerStatusId' }
      },
      registeredAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
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
    await queryInterface.dropTable('VolunteerRegistrations')
  }
}
