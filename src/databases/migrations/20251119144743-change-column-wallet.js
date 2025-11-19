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
    await queryInterface.addColumn('Wallets', 'receiveAmount', {
      type: Sequelize.DECIMAL(18, 2),
      defaultValue: 0
    })
    await queryInterface.removeColumn('Wallets', 'ownerType')
    await queryInterface.addColumn('Wallets', 'walletTypeId', {
      type: Sequelize.INTEGER,
      references: { model: 'WalletTypes', key: 'walletTypeId' }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Wallets', 'receiveAmount')
    await queryInterface.addColumn('Wallets', 'ownerType', {
      type: Sequelize.STRING(50),
      allowNull: false
    })
    await queryInterface.removeColumn('Wallets', 'walletTypeId')
  }
}
