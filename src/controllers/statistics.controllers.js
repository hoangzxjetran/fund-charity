const HTTP_STATUS = require('../constants/httpStatus')
const statisticsServices = require('../services/statistics.services')

class StatisticsControllers {
  async getStatistics(req, res) {
    // Logic to gather statistics data
    const { startTime, endTime } = req.query
    const data = await statisticsServices.getStatistics({ startTime, endTime })
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }

  async getDonationByMonth(req, res) {
    const data = await statisticsServices.getDonationByMonth()
    res.status(HTTP_STATUS.OK).json({
      data
    })
  }
}

module.exports = new StatisticsControllers()
