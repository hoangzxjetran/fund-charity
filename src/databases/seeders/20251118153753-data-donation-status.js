'use strict'

const { donationStatus } = require('../../constants/enum')

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
      'DonationStatuses',
      [
        {
          donationStatusId: donationStatus.Pending,
          statusName: 'Đang chờ xử lý',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          donationStatusId: donationStatus.Completed,
          statusName: 'Hoàn thành',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          donationStatusId: donationStatus.Failed,
          statusName: 'Đã hủy',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          donationStatusId: donationStatus.Refunded,
          statusName: 'Đã hoàn tiền',
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
    await queryInterface.bulkDelete('DonationStatuses', null, {})
  }
}
