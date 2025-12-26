'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const table = await queryInterface.describeTable('Users')
    if (!table.isShowAsAnonymous) {
      await queryInterface.addColumn('Users', 'isShowAsAnonymous', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      })
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const table = await queryInterface.describeTable('Users')

    if (table.isShowAsAnonymous) {
      await queryInterface.removeColumn('Users', 'isShowAsAnonymous')
    }
  }
}
