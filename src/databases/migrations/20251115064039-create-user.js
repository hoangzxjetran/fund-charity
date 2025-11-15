'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.STRING(50) },
      lastName: { type: Sequelize.STRING(50) },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(100), allowNull: false },
      phoneNumber: { type: Sequelize.STRING(15) },
      avatar: { type: Sequelize.STRING(255) },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      refreshToken: { type: Sequelize.STRING(255) },
      accessTokenForgotPassword: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
}
