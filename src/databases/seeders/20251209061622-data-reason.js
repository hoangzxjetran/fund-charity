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
      'ReportReasons',
      [
        {
          title: 'Có dấu hiệu lừa đảo / scam',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Sao chép nội dung từ chiến dịch khác',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Thông tin người nhận hỗ trợ không tồn tại hoặc không xác thực',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Hoạt động đáng ngờ trên hệ thống',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Khác',
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
    await queryInterface.bulkDelete('ReportReasons', null, {})
  }
}
