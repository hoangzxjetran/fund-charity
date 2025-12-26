const userVerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Banned: 2
}
const orgStatus = {
  Pending: 1,
  Reject: 2,
  Active: 3,
  Banned: 4
}

const campaignStatus = {
  Active: 1,
  Paused: 2,
  Completed: 3,
  Closed: 4
}

const roleType = {
  User: 1,
  Admin: 2,
  Organization: 3,
  MemberOfOrganization: 4
}

const donationStatus = {
  Pending: 1,
  Completed: 2,
  Failed: 3,
  Refunded: 4
}

const volunteerStatus = {
  PendingApproval: 1,
  Active: 2,
  Rejected: 3
}

const mediaType = {
  Image: 1,
  Video: 2,
  Document: 3,
  Audio: 4,
  Other: 5
}

const tokenType = {
  AccessToken: 0,
  RefreshToken: 1,
  ResetPasswordToken: 2,
  EmailVerifyToken: 3
}
const walletType = {
  User: 1,
  Organization: 2,
  Campaign: 3,
  Admin: 4
}

const transactionType = {
  Inflow: 1,
  Outflow: 2
}
const transactionStatus = {
  Pending: 1,
  Completed: 2,
  Failed: 3,
  Rejected: 4
}

const withdrawalStatus = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Completed: 4
}
const walletStatus = {
  Active: 1,
  Suspended: 2,
  Closed: 3
}

module.exports = {
  userVerifyStatus,
  orgStatus,
  campaignStatus,
  roleType,
  donationStatus,
  volunteerStatus,
  mediaType,
  tokenType,
  walletType,
  transactionType,
  transactionStatus,
  withdrawalStatus,
  walletStatus
}
