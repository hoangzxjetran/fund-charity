const db = require('../models')
class StatisticsServices {
  async getStatistics({ startTime, endTime }) {
    const whereClause = {}
    if (startTime && endTime) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [new Date(startTime), new Date(endTime)]
      }
    }
    const donationStats = db.Donation.findAll({
      attributes: [
        [db.Sequelize.fn('COUNT', db.Sequelize.col('donationId')), 'totalDonations'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalAmount']
      ],
      where: whereClause
    })

    const withdrawalStats = db.Withdrawal.findAll({
      attributes: [
        [db.Sequelize.fn('COUNT', db.Sequelize.col('withdrawalId')), 'totalWithdrawals'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalAmount']
      ],
      where: whereClause
    })

    const campaignStats = db.Campaign.findAll({
      attributes: [
        [db.Sequelize.fn('COUNT', db.Sequelize.col('campaignId')), 'totalCampaigns'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('currentAmount')), 'currentAmount']
      ],
      where: whereClause
    })
    const userStats = db.User.findAll({
      attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('userId')), 'totalUsers']],
      where: whereClause
    })

    const organizationStats = db.Organization.findAll({
      attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('orgId')), 'totalOrganizations']],
      where: whereClause
    })

    const volunteerStats = db.VolunteerRegistration.findAll({
      attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('registrationId')), 'totalVolunteers']],
      where: whereClause
    })

    return Promise.all([
      organizationStats,
      volunteerStats,
      donationStats,
      withdrawalStats,
      campaignStats,
      userStats
    ]).then(([organizationData, volunteerData, donationData, withdrawalData, campaignData, userData]) => ({
      organizations: organizationData[0],
      volunteers: volunteerData[0],
      donations: donationData[0],
      withdrawals: withdrawalData[0],
      campaigns: campaignData[0],
      users: userData[0]
    }))
  }

  async getDonationByMonth() {
    const year = new Date().getFullYear()
    const data = await db.Donation.findAll({
      attributes: [
        [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalAmount'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('donationId')), 'totalDonations']
      ],
      where: db.Sequelize.where(db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')), year),
      group: [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('createdAt'), '%Y-%m')],
      order: [[db.Sequelize.literal('month'), 'ASC']]
    })

    const months = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, '0')
      return `${year}-${month}`
    })

    const mapData = data.reduce((acc, item) => {
      acc[item.getDataValue('month')] = {
        totalAmount: Number(item.getDataValue('totalAmount')),
        totalDonations: Number(item.getDataValue('totalDonations'))
      }
      return acc
    }, {})

    return months.map((month) => ({
      month,
      totalAmount: mapData[month]?.totalAmount || 0,
      totalDonations: mapData[month]?.totalDonations || 0
    }))
  }
}

module.exports = new StatisticsServices()
