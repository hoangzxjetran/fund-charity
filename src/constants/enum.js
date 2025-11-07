const userVerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Banned: 2
}

const mediaType = {
  Image: 0,
  Video: 1
}

const tokenType = {
  AccessToken: 0,
  RefreshToken: 1,
  ResetPasswordToken: 2,
  EmailVerifyToken: 3
}

const roleType = {
  User: 0,
  Admin: 1
}

module.exports = {
  userVerifyStatus,
  mediaType,
  tokenType,
  roleType
}
