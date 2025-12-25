const { AppError } = require('../controllers/error.controllers.js')
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses')
const { config } = require('dotenv')
const fs = require('fs')
const path = require('path')
const HTTP_STATUS = require('../constants/httpStatus.js')
config()

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const forgotPasswordTemplate = fs.readFileSync(path.join(__dirname, '../template/forgot-password.html'), 'utf-8')
const closeCampaignTemplate = fs.readFileSync(path.join(__dirname, '../template/closed-campaign.html'), 'utf-8')
const withdrawalApprovedTemplate = fs.readFileSync(path.join(__dirname, '../template/withdrawal.html'), 'utf-8')
const notifyWithdrawalToUserTemplate = fs.readFileSync(
  path.join(__dirname, '../template/notify-withdrawal-to-user.html'),
  'utf-8'
)
const createSendEmailCommand = ({ toAddress, subject, template, textBody }) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [process.env.AWS_SES_CC_EMAIL],
      ToAddresses: [toAddress]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: template
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    ReplyToAddresses: [],
    Source: process.env.AWS_SES_CC_EMAIL
  })
}

const sendForgotPasswordEmail = async ({ toAddress, userName }) => {
  try {
    const contentTemplateForgotPassword = forgotPasswordTemplate
      .replace('{{YEAR}}', new Date().getFullYear().toString())
      .replace('{{RESET_LINK}}', `${process.env.CLIENT_URL}/reset-password?token=${passwordToken}`)
    const command = createSendEmailCommand({
      toAddress,
      subject: 'Forgot Password',
      template: contentTemplateForgotPassword,
      textBody: 'Please click the link to reset your password.'
    })
    const data = await sesClient.send(command)
    return data.$metadata.httpStatusCode === HTTP_STATUS.OK
  } catch (error) {
    throw new AppError('Failed to send email', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const sendCloseCampaignEmail = async ({ toAddress, userName, campaignName, campaignId }) => {
  try {
    const contentTemplateCloseCampaign = closeCampaignTemplate
      .replace('{{user_name}}', userName)
      .replace('{{campaign_name}}', campaignName)
      .replace('{{campaign_id}}', campaignId)
      .replace('{{closed_date}}', new Date().toLocaleDateString('vi-VN'))
      .replace('{{appeal_days}}', '7')
      .replace('{{year}}', new Date().getFullYear().toString())
    const command = createSendEmailCommand({
      toAddress,
      subject: 'Campaign Closed Notification',
      template: contentTemplateCloseCampaign,
      textBody: 'Your campaign has been closed. Thank you for your support!'
    })
    const data = await sesClient.send(command)
    return data.$metadata.httpStatusCode === HTTP_STATUS.OK
  } catch (error) {
    throw new AppError('Failed to send email', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const sendWithdrawalApprovedEmail = async ({ toAddress, userName, amount, withdrawalId }) => {
  try {
    const contentTemplateWithdrawalApproved = withdrawalApprovedTemplate
      .replace('{{user_name}}', userName)
      .replace('{{amount}}', amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }))
      .replace('{{withdrawal_id}}', withdrawalId)
      .replace(
        '{{processing_time}}',
        new Date().toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
      .replace('{{year}}', new Date().getFullYear().toString())
    const command = createSendEmailCommand({
      toAddress,
      subject: 'Thông báo yêu cầu rút tiền đã được chấp nhận',
      template: contentTemplateWithdrawalApproved,
      textBody: 'Yêu cầu rút tiền của bạn đã được chấp nhận. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!'
    })
    const data = await sesClient.send(command)
    return data.$metadata.httpStatusCode === HTTP_STATUS.OK
  } catch (error) {
    throw new AppError('Failed to send email', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const sendNotifyWithdrawalToUser = async ({ toAddress, fundName, userName, amount, withdrawalId, purpose, fundId }) => {
  // Implementation for sending notification email to user about withdrawal
  try {
    const contentTemplateNotifyWithdrawal = notifyWithdrawalToUserTemplate
      .replace('{{user_name}}', userName)
      .replace('{{fund_name}}', fundName)
      .replace('{{amount}}', amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }))
      .replace('{{withdrawal_id}}', withdrawalId)
      .replace(
        '{{withdrawal_time}}',
        new Date().toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
      .replace('{{purpose}}', purpose)
      .replace('{{fund_detail_url}}', `${process.env.CLIENT_URL}/campaigns/${fundId}`)
      .replace('{{support_email}}', 'admin@gmail.com')
      .replace('{{year}}', new Date().getFullYear().toString())
    const command = createSendEmailCommand({
      toAddress,
      subject: `Thông báo về  việc chủ quỹ ${fundName} rút tiền quyên góp`,
      template: contentTemplateNotifyWithdrawal,
      textBody: `Thông báo về việc chủ quỹ ${fundName} rút tiền quyên góp. Vui lòng kiểm tra chi tiết trong email.`
    })
    const data = await sesClient.send(command)
    return data.$metadata.httpStatusCode === HTTP_STATUS.OK
  } catch (error) {
    throw new AppError('Failed to send email', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}
module.exports = {
  sendForgotPasswordEmail,
  sendCloseCampaignEmail,
  sendWithdrawalApprovedEmail,
  sendNotifyWithdrawalToUser
}
