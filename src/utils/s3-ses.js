const AppError = require('../controllers/error.controllers.js')
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

const sendForgotPasswordEmail = async ({ toAddress, passwordToken }) => {
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
module.exports = { sendForgotPasswordEmail }
