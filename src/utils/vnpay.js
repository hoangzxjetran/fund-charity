const crypto = require('crypto')
const qs = require('querystring')
const moment = require('moment')
const dotenv = require('dotenv')
dotenv.config()

const { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL, VNP_RETURN_URL, VNP_SECURE_HASH_TYPE = 'sha512' } = process.env

function hashHmac(hashType, data, secret) {
  const algo = hashType.toLowerCase().includes('sha512') ? 'sha512' : 'sha256'
  return crypto.createHmac(algo, secret).update(data, 'utf8').digest('hex')
}

function sortObject(obj) {
  let sorted = {}
  let keys = Object.keys(obj).sort()
  keys.forEach((key) => {
    sorted[key] = obj[key]
  })
  return sorted
}
function createPaymentUrl({ donationId, amount, orderInfo, ipAddr }) {
  const createDate = moment().format('YYYYMMDDHHmmss')

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: donationId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'donation',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  }

  vnp_Params = sortObject(vnp_Params)

  let signData = qs.stringify(vnp_Params)
  let hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
  let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed

  return VNP_URL + '?' + qs.stringify(vnp_Params)
}

function verifyResponse(query) {
  const copy = { ...query }
  const vnp_SecureHash = query.vnp_SecureHash
  delete copy.vnp_SecureHash
  const signData = qs.stringify(copy)
  const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
  const checkSum = hmac.update(signData).digest('hex')

  const valid = vnp_SecureHash === checkSum
  return {
    valid,
    data: copy,
    message: valid
      ? copy.vnp_ResponseCode === '00'
        ? 'Thanh toán thành công'
        : 'Thanh toán thất bại'
      : 'Dữ liệu không hợp lệ'
  }
}

module.exports = { createPaymentUrl, verifyResponse }
