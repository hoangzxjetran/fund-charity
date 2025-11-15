'use strict'

const { mediaType } = require('../../constants/enum')

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

    const mediaData = Object.entries(mediaType).map(([key, value]) => ({
      mediaTypeId: value,
      mediaName: key,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    return queryInterface.bulkInsert('Media', mediaData, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Media', null, {})
  }
}
