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
      'VolunteerStatuses',
      [
        {
          statusId: 1,
          statusName: 'Chờ xét duyệt',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          statusId: 2,
          statusName: 'Đang hoạt động',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          statusId: 3,
          statusName: 'Từ chối',
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
    return queryInterface.bulkDelete('VolunteerStatuses', null, {})
  }
}
