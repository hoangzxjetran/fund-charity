'use strict'

/** @type {import('sequelize-cli').Migration} */
'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Withdrawals')
    if (table.toBankAccountId) {
      await queryInterface.removeColumn('Withdrawals', 'toBankAccountId')
    }
    if (!table.toWalletId) {
      await queryInterface.addColumn('Withdrawals', 'toWalletId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Wallets',
          key: 'walletId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
    if(!table.approvedBy) {
      await queryInterface.addColumn('Withdrawals', 'approvedBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
    if (!table.purpose) {
      await queryInterface.addColumn('Withdrawals', 'purpose', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }

    if (!table.reasonRejected) {
      await queryInterface.addColumn('Withdrawals', 'reasonRejected', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Withdrawals')
    if (!table.toBankAccountId) {
      await queryInterface.addColumn('Withdrawals', 'toBankAccountId', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    }
    if (table.toWalletId) {
      await queryInterface.removeColumn('Withdrawals', 'toWalletId')
    }
    if (table.approvedBy) {
      await queryInterface.removeColumn('Withdrawals', 'approvedBy')
    }
    if (table.purpose) {
      await queryInterface.removeColumn('Withdrawals', 'purpose')
    }
    if (table.reasonRejected) {
      await queryInterface.removeColumn('Withdrawals', 'reasonRejected')
    }
  }
}
