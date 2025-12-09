const reasonsServices = require("../services/reasons.services.js");

class ReasonControllers {
  async getAll(req, res) {
    const reasons = await reasonsServices.getAll()
    return res.status(200).json({
      data: reasons
    })
  }
}
module.exports = new ReasonControllers()
