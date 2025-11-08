'use strict'

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
    return queryInterface.bulkInsert(
      'MilestoneStatuses',
      [
        {
          milestoneStatusId: 1,
          milestoneStatusName: 'Chờ xử lý',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          milestoneStatusId: 2,
          milestoneStatusName: 'Đang thực hiện',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          milestoneStatusId: 3,
          milestoneStatusName: 'Tạm dừng',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          milestoneStatusId: 4,
          milestoneStatusName: 'Hoàn thành',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          milestoneStatusId: 5,
          milestoneStatusName: 'Đã hủy',
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
    return queryInterface.bulkDelete('MilestoneStatuses', null, {})
  }
}
