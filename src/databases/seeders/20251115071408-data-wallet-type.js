'use strict'

const { donationStatus, walletType } = require('../../constants/enum')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'WalletTypes',
      [
        {
          walletTypeId: walletType.User,
          walletTypeName: 'Ví người dùng',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          walletTypeId: walletType.Organization,
          walletTypeName: 'Ví tổ chức',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          walletTypeId: walletType.Campaign,
          walletTypeName: 'Ví chiến dịch',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          walletTypeId: walletType.Admin,
          walletTypeName: 'Ví quản trị',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('WalletTypes', null, {})
  }
}
