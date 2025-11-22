const HTTP_STATUS = require('../constants/httpStatus')
const paymentsServices = require('../services/payments.services')

class PaymentsControllers {
  async createPayment(req, res) {
    const { campaignId, amount, userId, isAnonymous, email, address, phoneNumber, message } = req.body
    const { ip } = req
    const paymentUrl = await paymentsServices.createPayment({
      userId,
      campaignId,
      amount,
      isAnonymous,
      email,
      address,
      phoneNumber,
      message,
      ipAddr: ip
    })
    return res.status(HTTP_STATUS.OK).json({
      data: paymentUrl
    })
  }

  async checkPayment(req, res) {
    const result = await paymentsServices.checkPayment(req.query)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }
}

module.exports = new PaymentsControllers()
