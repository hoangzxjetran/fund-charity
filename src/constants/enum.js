const userVerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Banned: 2
}
const milestoneStatus = {
  Pending: 1,
  InProgress: 2,
  Paused: 3,
  Completed: 4,
  Cancelled: 5
}

const donationStatus = {
  Pending: 1,
  Completed: 2,
  Failed: 3,
  Refunded: 4
}

const fundStatus = {
  Draft: 1,
  Active: 2,
  Suspended: 3,
  Completed: 4,
  Cancelled: 5
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

const roleType = {
  User: 1,
  Admin: 2
}

const fundraisingMethod = {
  Milestone: 1,
  TimeBased: 2
}

module.exports = {
  userVerifyStatus,
  mediaType,
  tokenType,
  roleType,
  milestoneStatus,
  donationStatus,
  fundStatus,
  volunteerStatus,
  fundraisingMethod
}
