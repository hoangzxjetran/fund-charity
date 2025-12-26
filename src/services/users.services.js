const db = require('../models/index.js')
const { tokenType, roleType } = require('../constants/enum.js')
const { generateToken, verifyToken } = require('../utils/jwt.js')
const { AppError } = require('../controllers/error.controllers.js')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js')
const { USER_MESSAGES } = require('../constants/message.js')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { sendForgotPasswordEmail } = require('../utils/s3-ses.js')

class UserServices {
  signAccessToken(userId) {
    return generateToken(
      {
        userId,
        tokenType: tokenType.AccessToken
      },
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h'
    )
  }
  signRefreshToken(userId, exp) {
    if (exp) {
      return generateToken(
        {
          userId,
          tokenType: tokenType.RefreshToken,
          exp
        },
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
      )
    }
    return generateToken(
      {
        userId,
        tokenType: tokenType.RefreshToken
      },
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
    )
  }
  signForgotPasswordToken(userId) {
    return generateToken(
      {
        userId,
        tokenType: tokenType.ResetPasswordToken
      },
      process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN || '5m'
    )
  }

  async refreshToken(userId, refreshTokenStr) {
    const decodedRefreshToken = await verifyToken(refreshTokenStr)
    if (!decodedRefreshToken || decodedRefreshToken.tokenType !== tokenType.RefreshToken) {
      throw new AppError(USER_MESSAGES.REFRESH_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(userId.toString()),
      this.signRefreshToken(userId.toString())
    ])

    await db.User.update(
      {
        refreshToken: newRefreshToken,
        updatedAt: new Date()
      },
      { where: { userId } }
    )

    return { accessToken, refreshToken: newRefreshToken }
  }

  async checkEmailExists(email) {
    const user = await db.User.findOne({ where: { email } })
    return !!user
  }

  async getUserByEmail(email) {
    const data = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.UserRole,
          as: 'roles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [
            { model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['orgId', 'orgName', 'statusId'],
              required: false
            }
          ]
        }
      ]
    })
    if (!data) return null
    const { password, accessTokenForgotPassword, ...user } = data.get({ plain: true })
    return user
  }

  async getUserById(userId) {
    const data = await db.User.findOne({
      where: { userId },
      include: [
        {
          model: db.UserRole,
          as: 'roles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [
            { model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['orgId', 'orgName', 'statusId'],
              required: false
            }
          ]
        }
      ]
    })
    if (!data) return null
    const { password, ...restUser } = data.get({ plain: true })
    return restUser
  }

  async signUp({ firstName, lastName, dateOfBirth, email, password, roleId = roleType.User, orgId = null }) {
    const t = await db.sequelize.transaction()
    let newUser
    try {
      newUser = await db.User.create(
        {
          firstName,
          lastName,
          dateOfBirth,
          email,
          password: hashPassword(password)
        },
        { transaction: t }
      )
      await db.UserRole.create(
        {
          userId: newUser.userId,
          roleId,
          orgId
        },
        { transaction: t }
      )

      await t.commit()
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
    const dataUser = await db.User.findOne({
      where: { userId: newUser.userId },
      attributes: { exclude: ['password', 'accessTokenForgotPassword'] },
      include: [
        {
          model: db.UserRole,
          as: 'roles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [
            { model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['orgId', 'orgName', 'statusId'],
              required: false
            }
          ]
        }
      ]
    })
    return dataUser
  }

  async signIn({ email, password }) {
    const foundUser = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.UserRole,
          as: 'roles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [
            { model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['orgId', 'orgName', 'statusId'],
              required: false
            }
          ]
        }
      ]
    })

    if (!foundUser) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }

    const { dataValues: user } = foundUser
    if (!user || !comparePassword(password, user?.password)) {
      throw new AppError(USER_MESSAGES.LOGIN_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user.userId.toString()),
      this.signRefreshToken(user.userId.toString())
    ])
    await db.User.update(
      {
        refreshToken,
        updatedAt: new Date()
      },
      {
        where: { userId: user.userId }
      }
    )
    const rolesClean = user?.roles?.map((r) => ({
      role: r.role,
      organization: r.organization || null
    }))
    const { password: _, accessTokenForgotPassword, ...restUser } = user
    return { ...restUser, roles: rolesClean, accessToken, refreshToken }
  }

  async forgotPassword({ userId, email }) {
    const forgotPasswordToken = await this.signForgotPasswordToken(userId.toString())
    await db.User.update(
      {
        accessTokenForgotPassword: forgotPasswordToken,
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    sendForgotPasswordEmail({
      toAddress: email,
      passwordToken: forgotPasswordToken
    })
    return true
  }

  async resetPassword({ userId, plainTextPassword }) {
    await db.User.update(
      {
        accessTokenForgotPassword: null,
        password: hashPassword(plainTextPassword),
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    return true
  }

  async changePassword({ userId, currentPassword, newPassword }) {
    if (!comparePassword(currentPassword, newPassword)) {
      throw new AppError(USER_MESSAGES.OLD_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST)
    }
    await db.User.update(
      {
        password: hashPassword(newPassword),
        updatedAt: new Date()
      },
      {
        where: { userId }
      }
    )
    return true
  }

  async updateProfile(userId, body) {
    await db.User.update(body, { where: { userId } })
    const updatedUser = await this.getUserById(userId)
    return updatedUser
  }

  async getUsers({ search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', isActive, role }) {
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10
    if (page < 1) page = 1
    if (limit < 1) limit = 10
    const offset = (page - 1) * limit

    const whereClause = {}
    if (typeof isActive === 'boolean') {
      whereClause.isActive = isActive
    }
    const userRoleWhere = {}
    if (role) {
      userRoleWhere.roleId = roleType[role] || role
    }

    if (search) {
      const likeSearch = `%${search.toLowerCase()}%`
      whereClause[db.Sequelize.Op.or] = [
        db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('User.firstName')), 'LIKE', likeSearch),
        db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('User.lastName')), 'LIKE', likeSearch),
        db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('User.email')), 'LIKE', likeSearch)
      ]
    }

    const validSortBy = ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt']
    if (!validSortBy.includes(sortBy)) sortBy = 'createdAt'
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

    const total = await db.User.count({
      where: whereClause,
      include: role
        ? [
            {
              model: db.UserRole,
              as: 'roles',
              where: userRoleWhere,
              required: true
            }
          ]
        : []
    })

    const users = await db.User.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      attributes: { exclude: ['password', 'refreshToken', 'accessTokenForgotPassword'] },
      include: [
        {
          model: db.UserRole,
          as: 'roles',
          attributes: ['userRoleId', 'roleId', 'orgId', 'createdAt', 'updatedAt'],
          where: role ? userRoleWhere : undefined,
          required: !!role,
          include: [
            { model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['orgId', 'orgName', 'statusId'],
              required: false
            }
          ]
        }
      ]
    })

    return {
      data: users,
      pagination: {
        total,
        page,
        limit
      }
    }
  }

  async deleteUser(userId) {
    await db.User.update(
      {
        isActive: false,
        updatedAt: new Date()
      },
      { where: { userId } }
    )
    return true
  }
}
module.exports = new UserServices()
