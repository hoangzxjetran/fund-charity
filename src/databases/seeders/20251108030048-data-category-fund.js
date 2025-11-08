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
      'CategoryFunds',
      [
        { categoryId: 1, categoryName: 'Trẻ em', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/children.svg' },
        { categoryId: 2, categoryName: 'Người khuyết tật', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/disable-people.svg' },
        { categoryId: 3, categoryName: 'Giáo dục', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/education.svg' },
        { categoryId: 4, categoryName: 'Người cao tuổi', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/elder-people.svg' },
        { categoryId: 5, categoryName: 'Môi trường', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/enviroment.svg' },
        { categoryId: 6, categoryName: 'Dân tộc thiểu số', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/ethnic-minorities.svg' },
        { categoryId: 7, categoryName: 'Xóa đói', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/hunger-eradication.svg' },
        { categoryId: 8, categoryName: 'Thiên tai', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/natural-disasters.svg' },
        { categoryId: 9, categoryName: 'Người nghèo', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/poor-people.svg' },
        { categoryId: 10, categoryName: 'Bệnh hiểm nghèo', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/virus.svg' },
        { categoryId: 11, categoryName: 'Xóa nghèo', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/poverty-alleviation.svg' },
        { categoryId: 12, categoryName: 'Khác', logoIcon: 'https://twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com/fund-categories/other.svg' }
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
    return queryInterface.bulkDelete('CategoryFunds', null, {})
  }
}
