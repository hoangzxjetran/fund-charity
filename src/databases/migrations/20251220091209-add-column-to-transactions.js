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
    const table = await queryInterface.describeTable('Transactions')
    if (table.bankName) {
      await queryInterface.removeColumn('Transactions', 'bankName')
    }
    if (table.accountNumber) {
      await queryInterface.removeColumn('Transactions', 'accountNumber')
    }
    if (table.accountHolder) {
      await queryInterface.removeColumn('Transactions', 'accountHolder')
    }
    if (table.bankRef) {
      await queryInterface.removeColumn('Transactions', 'bankRef')
    }
    if (table.proofImage) {
      await queryInterface.removeColumn('Transactions', 'proofImage')
    }
    if (!table.withdrawalId) {
      await queryInterface.addColumn('Transactions', 'withdrawalId', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    }

    if (!table.balanceBefore) {
      await queryInterface.addColumn('Transactions', 'balanceBefore', {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true
      })
    }

    if (!table.balanceAfter) {
      await queryInterface.addColumn('Transactions', 'balanceAfter', {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true
      })
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const table = await queryInterface.describeTable('Transactions')

    if (!table.bankName) {
      await queryInterface.addColumn('Transactions', 'bankName', {
        type: Sequelize.STRING
      })
    }

    if (!table.accountNumber) {
      await queryInterface.addColumn('Transactions', 'accountNumber', {
        type: Sequelize.STRING
      })
    }

    if (!table.accountHolder) {
      await queryInterface.addColumn('Transactions', 'accountHolder', {
        type: Sequelize.STRING
      })
    }

    if (!table.bankRef) {
      await queryInterface.addColumn('Transactions', 'bankRef', {
        type: Sequelize.STRING
      })
    }

    if (!table.proofImage) {
      await queryInterface.addColumn('Transactions', 'proofImage', {
        type: Sequelize.STRING
      })
    }

    if (table.withdrawalId) {
      await queryInterface.removeColumn('Transactions', 'withdrawalId')
    }

    if (table.balanceBefore) {
      await queryInterface.removeColumn('Transactions', 'balanceBefore')
    }

    if (table.balanceAfter) {
      await queryInterface.removeColumn('Transactions', 'balanceAfter')
    }
  }
}
