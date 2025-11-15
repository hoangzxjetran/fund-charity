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
    await queryInterface.bulkInsert(
      'WithdrawalStatuses',
      [
        {
          withdrawalStatusId: 1,
          statusName: 'Pending',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          withdrawalStatusId: 2,
          statusName: 'Approved',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          withdrawalStatusId: 3,
          statusName: 'Rejected',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          withdrawalStatusId: 4,
          statusName: 'Completed',
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
    await queryInterface.bulkDelete('WithdrawalStatuses', null, {})
  }
}
