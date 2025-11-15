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
      'CampaignStatuses',
      [
        {
          campaignStatusId: 1,
          statusName: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          campaignStatusId: 2,
          statusName: 'Paused',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          campaignStatusId: 3,
          statusName: 'Completed',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          campaignStatusId: 4,
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
    return queryInterface.bulkDelete('CampaignStatuses', null, {})
  }
}
