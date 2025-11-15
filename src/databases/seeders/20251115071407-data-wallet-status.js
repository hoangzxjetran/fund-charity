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
      'WalletStatuses',
      [
        {
          walletStatusId: 1,
          statusName: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          walletStatusId: 2,
          statusName: 'Suspended',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          walletStatusId: 3,
          statusName: 'Closed',
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
    return queryInterface.bulkDelete('WalletStatuses', null, {})
  }
}
