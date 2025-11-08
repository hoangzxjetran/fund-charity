const userVerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Banned: 2
}

const mediaType = {
  Image: 1,
  Video: 2
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

module.exports = {
  userVerifyStatus,
  mediaType,
  tokenType,
  roleType
}
