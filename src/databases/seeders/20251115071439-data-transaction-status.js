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
      'TransactionStatuses',
      [
        {
          transactionStatusId: 1,
          statusName: 'Pending',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          transactionStatusId: 2,
          statusName: 'Completed',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          transactionStatusId: 3,
          statusName: 'Failed',
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
    await queryInterface.bulkDelete('TransactionStatuses', null, {})
  }
}
