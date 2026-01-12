const cron = require('node-cron')
const campaignsServices = require('../../services/campaigns.services')
const donationsServices = require('../../services/donations.services')
const { sendWarningDisbursedEmail } = require('../s3-ses')

const disbursedWarning = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const campaigns = await campaignsServices.getCampaignNotDisbursed()
      for (const campaign of campaigns) {
        if (new Date() < new Date(campaign.endDate)) continue
        const userDonations = await donationsServices.getUserDonationsCampaignDisbursed({
          campaignId: campaign.campaignId,
          timeCloseCampaign: campaign.endDate
        })
        for (const userDonation of userDonations) {
          if (!userDonation.user?.email) continue
          const totalAmount = Number(userDonation.get('totalAmount'))
          const sent = await sendWarningDisbursedEmail({
            toAddress: userDonation?.user?.email,
            userName: `${userDonation?.user?.firstName} ${userDonation?.user?.lastName}`,
            fundName: campaign?.title,
            endDate: campaign?.endDate,
            totalAmount
          })
          if (!sent) {
            console.warn(`[CRON] Failed to send email to ${userDonation?.user?.email}`)
          }
        }
        await campaignsServices.updateLastReminderSentAt(campaign?.campaignId)
      }
    } catch (error) {
      console.error('[CRON] Disbursed warning error:', error)
    }
  })
}
module.exports = disbursedWarning
