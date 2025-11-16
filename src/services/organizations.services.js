const { orgStatus, roleType, walletStatus } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus')
const { ORGANIZATION_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const db = require('../models')
const { deleteImageFromS3 } = require('../utils/s3-bucket')
class OrganizationServices {
  async createOrganization(userId, data) {
    const t = await db.sequelize.transaction()

    try {
      const organization = await db.Organization.create(
        {
          orgName: data.orgName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          description: data.description,
          website: data.website,
          avatar: data.avatar,
          createdBy: userId,
          statusId: orgStatus.Active
        },
        { transaction: t }
      )
      const orgId = organization.orgId
      const userRole = await db.UserRole.create(
        {
          userId,
          orgId,
          roleId: roleType.Organization
        },
        { transaction: t }
      )

      for (const bank of data.banks) {
        await db.OrgBank.create(
          {
            orgId,
            bankName: bank.bankName,
            bankAccount: bank.bankAccount,
            branch: bank.branch,
            accountHolder: bank.accountHolder,
            statusId: orgStatus.Active
          },
          { transaction: t }
        )
      }
      const banks = await db.OrgBank.findOne({ where: { orgId }, transaction: t })
      const wallet = await db.Wallet.create(
        {
          ownerId: orgId,
          ownerType: 'Organization',
          balance: 0,
          statusId: walletStatus.Active
        },
        { transaction: t }
      )
      await t.commit()
      return {
        organization: organization.get({ plain: true }),
        role: userRole.get({ plain: true }),
        banks: banks.get({ plain: true }),
        wallet: wallet.get({ plain: true })
      }
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  async getOrganizationById(organizationId) {
    const organization = await db.Organization.findByPk(organizationId, {
      include: [
        {
          model: db.OrgBank,
          as: 'banks'
        },
        {
          model: db.Campaign,
          as: 'campaigns'
        },
        {
          model: db.UserRole,
          as: 'userRoles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [{ model: db.Role, as: 'role', attributes: ['roleId', 'roleName'] }]
        },
        {
          model: db.OrgMedia,
          as: 'media'
        },
        {
          model: db.Wallet,
          as: 'wallets',
          attributes: { exclude: ['statusId'] },
          include: [
            {
              model: db.WalletStatus,
              as: 'status'
            }
          ]
        }
      ]
    })
    return organization
  }

  async getOrganizations({ page, limit, search, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const offset = (page - 1) * limit
    const whereClause = {}
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { orgName: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { phoneNumber: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }

    const organizations = await db.Organization.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    })
    return {
      data: organizations.rows,
      pagination: {
        page,
        limit,
        total: organizations.count
      }
    }
  }
  async updateOrganization(organizationId, data) {
    const organization = await db.Organization.findByPk(organizationId, {
      include: [
        { model: db.OrgMedia, as: 'media' },
        { model: db.OrgBank, as: 'banks' }
      ]
    })

    if (!organization) throw new AppErrorError(ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND)

    return await db.sequelize.transaction(async (t) => {
      await organization.update(
        {
          orgName: data.orgName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          description: data.description,
          website: data.website,
          avatar: data.avatar
        },
        { transaction: t }
      )
      if (data.media && data.media.length > 0) {
        const existingMedia = organization.media.map((m) => m.url)
        const mediaToDelete = existingMedia.filter((url) => !data.media.map((m) => m.url).includes(url))
        const mediaToAdd = data.media.filter((m) => !existingMedia.includes(m.url))

        if (mediaToDelete.length > 0) {
          await db.OrgMedia.destroy({ where: { orgId: organizationId, url: mediaToDelete }, transaction: t })
          await deleteImageFromS3(mediaToDelete)
        }

        if (mediaToAdd.length > 0) {
          const mediaRecords = mediaToAdd.map((media) => ({
            orgId: organizationId,
            mediaTypeId: media.mediaType,
            url: media.url
          }))
          await db.OrgMedia.bulkCreate(mediaRecords, { transaction: t })
        }
      }
      if (data.banks && data.banks.length > 0) {
        const existingBankIds = organization.banks.map((b) => b.bankAccountId)
        const newBankIds = data.banks.filter((b) => b.bankAccountId).map((b) => b.bankAccountId)
        const banksToDelete = existingBankIds.filter((id) => !newBankIds.includes(id))
        if (banksToDelete.length > 0) {
          await db.OrgBank.destroy({ where: { bankAccountId: banksToDelete }, transaction: t })
        }
        for (const bank of data.banks) {
          if (bank.bankAccountId && existingBankIds.includes(bank.bankAccountId)) {
            await db.OrgBank.update(
              {
                bankName: bank.bankName,
                bankAccount: bank.bankAccount,
                branch: bank.branch,
                accountHolder: bank.accountHolder
              },
              { where: { bankAccountId: bank.bankAccountId }, transaction: t }
            )
          } else {
            await db.OrgBank.create(
              {
                orgId: organizationId,
                bankName: bank.bankName,
                bankAccount: bank.bankAccount,
                branch: bank.branch,
                accountHolder: bank.accountHolder,
                statusId: orgStatus.Active
              },
              { transaction: t }
            )
          }
        }
      }
      const updatedOrganization = await db.Organization.findByPk(organizationId, {
        include: [
          {
            model: db.OrgMedia,
            as: 'media',
            attributes: { exclude: ['mediaTypeId'] },
            include: [{ model: db.Media, as: 'mediaType', attributes: { exclude: ['createdAt', 'updatedAt'] } }]
          },
          { model: db.OrgBank, as: 'banks' },
          { model: db.Campaign, as: 'campaigns' },
          {
            model: db.Wallet,
            as: 'wallets',
            attributes: { exclude: ['statusId'] },
            include: [{ model: db.WalletStatus, as: 'status' }]
          }
        ],
        transaction: t
      })

      return updatedOrganization
    })
  }
}
module.exports = new OrganizationServices()
