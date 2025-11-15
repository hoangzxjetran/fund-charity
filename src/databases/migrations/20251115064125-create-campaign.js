'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      campaignId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orgId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Organizations', key: 'orgId' } },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'CategoryFundraisings', key: 'categoryId' }
      },
      title: { type: Sequelize.STRING(255) },
      description: { type: Sequelize.TEXT },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      targetAmount: { type: Sequelize.DECIMAL(18, 2) },
      currentAmount: { type: Sequelize.DECIMAL(18, 2), defaultValue: 0 },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'CampaignStatuses', key: 'campaignStatusId' }
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns')
  }
}
