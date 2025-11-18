'use strict'

const { roleType, walletType, walletStatus } = require('../../constants/enum')
const { hashPassword } = require('../../utils/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert(
        'Users',
        [
          {
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@gmail.com',
            password: hashPassword('Zaqw1234@'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )
      const [results] = await queryInterface.sequelize.query(
        `SELECT userId FROM Users WHERE email = 'admin@gmail.com' LIMIT 1`,
        { transaction }
      )
      const newUserId = results[0].userId
      await queryInterface.bulkInsert(
        'UserRoles',
        [
          {
            userId: newUserId,
            roleId: roleType.Admin,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )
      await queryInterface.bulkInsert(
        'Wallets',
        [
          {
            ownerType: 'Admin',
            ownerId: newUserId,
            statusId: walletStatus.Active,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wallets', { ownerType: walletType.Admin }, {})
    await queryInterface.bulkDelete('UserRoles', {}, {})
    await queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' }, {})
  }
}
