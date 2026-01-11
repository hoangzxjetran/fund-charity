'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageMedia', {
      messageMediaId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Messages', key: 'messageId' },
        onDelete: 'CASCADE'
      },
      mediaUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mediaTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Media', key: 'mediaTypeId' },
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('MessageMedia')
  }
}
