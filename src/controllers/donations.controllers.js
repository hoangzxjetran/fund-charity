const HTTP_STATUS = require('../constants/httpStatus')
const DonationsServices = require('../services/donations.services')

class DonationsControllers {
  // Donation controller methods would be here
  async createDonation(req, res) {
    // Implementation for creating a donation
  }

  async getDonations(req, res) {
    // Implementation for retrieving donations
    const { campaignId } = req.params
    const { page, limit, search, sortBy, sortOrder } = req.query
    const data = await DonationsServices.getDonationsByCampaign({ campaignId, page, limit, search, sortBy, sortOrder })
    return res.status(HTTP_STATUS.OK).json(data)
  }

  async getDonationById(req, res) {
    // Implementation for retrieving a donation by ID
  }

  async updateDonation(req, res) {
    // Implementation for updating a donation
  }

  async deleteDonation(req, res) {
    // Implementation for deleting a donation
  }
}

module.exports = new DonationsControllers()
