'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('OrgStatuses', [
     {
       orgStatusId: 1,
       orgStatusName: 'Pending',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       orgStatusId: 2,
       orgStatusName: 'Reject',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       orgStatusId: 3,
       orgStatusName: 'Active',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       orgStatusId: 4,
       orgStatusName: 'Banned',
       createdAt: new Date(),
       updatedAt: new Date()
     }
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('OrgStatuses', null, {});
  }
};
