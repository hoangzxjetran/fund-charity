'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Donations', 'paymentStatus')
    await queryInterface.addColumn('Donations', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'DonationStatuses', key: 'donationStatusId', onUpdate: 'CASCADE', onDelete: 'SET NULL' }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Donations', 'paymentStatus', {
      type: Sequelize.STRING(50),
      defaultValue: 'pending'
    })
    await queryInterface.removeColumn('Donations', 'statusId')
  }
}
