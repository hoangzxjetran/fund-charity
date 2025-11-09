'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FundMedia', {
      fundMediaId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      fundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Funds',
          key: 'fundId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      mediaType: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Media',
          key: 'mediaType'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
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
    await queryInterface.dropTable('FundMedia')
  }
}
