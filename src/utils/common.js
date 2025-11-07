const convertNumberEnumToArr = (enumObj) => {
  return Object.values(enumObj).filter((value) => typeof value === 'number')
}
module.exports = { convertNumberEnumToArr }
