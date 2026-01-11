'use strict'

const { friendRequestStatus } = require('../../constants/enum')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FriendRequests', {
      friendRequestId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        enum: Object.values(friendRequestStatus),
        defaultValue: friendRequestStatus.Pending
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
    await queryInterface.dropTable('FriendRequests')
  }
}
