const convertNumberEnumToArr = (enumObj) => {
  return Object.values(enumObj).filter((value) => typeof value === 'number')
}

const convertStringObjToNumberObj = (enumObj) => {
  return Object.fromEntries(Object.entries(enumObj).map(([key, value]) => [value, key]))
}
module.exports = { convertNumberEnumToArr, convertStringObjToNumberObj }
