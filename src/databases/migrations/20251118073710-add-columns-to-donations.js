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
    await queryInterface.removeConstraint('Donations', 'Donations_ibfk_1')
    await queryInterface.changeColumn('Donations', 'userId', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
    await queryInterface.addColumn('Donations', 'isAnonymous', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('Donations', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('Donations', 'fullName', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('Donations', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('Donations', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addConstraint('Donations', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Donations_ibfk_1',
      references: {
        table: 'Users',
        field: 'userId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    await queryInterface.removeColumn('Donations', 'isAnonymous')
    await queryInterface.removeColumn('Donations', 'email')
    await queryInterface.removeColumn('Donations', 'fullName')
    await queryInterface.removeColumn('Donations', 'phoneNumber')
    await queryInterface.removeColumn('Donations', 'address')
  }
}
