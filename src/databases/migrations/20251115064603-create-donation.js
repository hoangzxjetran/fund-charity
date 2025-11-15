'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
      donationId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'userId' } },
      campaignId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Campaigns', key: 'campaignId' } },
      amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
      paymentStatus: { type: Sequelize.STRING(50), defaultValue: 'pending' },
      donateDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      message: { type: Sequelize.STRING(255) }.type,
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
    await queryInterface.dropTable('Donations')
  }
}
