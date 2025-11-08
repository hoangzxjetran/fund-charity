'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Milestones', {
      milestoneId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      targetAmount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      achievedAmount: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      orderIndex: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      milestoneStatusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MilestoneStatuses',
          key: 'milestoneStatusId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Milestones')
  }
}
