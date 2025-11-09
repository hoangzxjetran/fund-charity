'use strict';

const { fundStatus } = require('../../constants/enum');

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
    await queryInterface.bulkInsert('FundStatuses', [
       {
        fundStatusId: fundStatus.Draft,
        fundStatusName: 'Nháp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fundStatusId: fundStatus.Active,
        fundStatusName: 'Đang diễn ra',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fundStatusId: fundStatus.Suspended,
        fundStatusName: 'Tạm ngưng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fundStatusId: fundStatus.Completed,
        fundStatusName: 'Đã kết thúc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fundStatusId: fundStatus.Cancelled,
        fundStatusName: 'Đã hủy',
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
    await queryInterface.bulkDelete('FundStatuses', null, {});
  }
};
