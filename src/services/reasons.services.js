const db = require('../models')

class ReasonServices {
  async getAll() {
    const reasons = await db.ReportReason.findAll({})
    return reasons
  }
}

module.exports = new ReasonServices()
