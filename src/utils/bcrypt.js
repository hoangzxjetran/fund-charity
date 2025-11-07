const bcrypt = require('bcryptjs')
const hashPassword = (plainTextPassword) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(plainTextPassword, salt)
}
const comparePassword = (plainTextPassword, hashedPassword) => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword)
}
module.exports = {
  hashPassword,
  comparePassword
}
