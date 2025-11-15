'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      notificationId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'userId' } },
      title: { type: Sequelize.STRING(255) },
      content: { type: Sequelize.STRING(500) },
      type: { type: Sequelize.STRING(50) },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      relatedDonationId: { type: Sequelize.INTEGER, references: { model: 'Donations', key: 'donationId' } },
      relatedWithdrawalId: { type: Sequelize.INTEGER, references: { model: 'Withdrawals', key: 'withdrawalId' } },
      relatedCampaignId: { type: Sequelize.INTEGER, references: { model: 'Campaigns', key: 'campaignId' } },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications')
  }
}
