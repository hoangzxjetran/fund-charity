'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CampaignMedia', {
      campaignMediaId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      campaignId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Campaigns', key: 'campaignId' } },
      mediaTypeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Media', key: 'mediaTypeId' } },
      url: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CampaignMedia')
  }
}
