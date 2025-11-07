'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Funds', {
      fundId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      methodId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FundraisingMethods',
          key: 'methodId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fundName: {
        type: Sequelize.STRING
      },
      bannerUrl: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      bankAccountNumber: {
        type: Sequelize.STRING
      },
      bankName: {
        type: Sequelize.STRING
      },
      urlQrCode: {
        type: Sequelize.STRING
      },
      targetAmount: {
        type: Sequelize.DOUBLE
      },
      currentAmount: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FundStatuses',
          key: 'fundStatusId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      categoryFund: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CategoryFunds',
          key: 'categoryId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
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
    await queryInterface.dropTable('Funds')
  }
}
