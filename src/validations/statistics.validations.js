const { checkSchema } = require('express-validator')
const validate = require('../utils/validate')
const { COMMON } = require('../constants/message')

const getStatsValidator = validate(
  checkSchema(
    {
      startTime: {
        optional: true,
        isISO8601: {
          errorMessage: COMMON.START_TIME_INVALID
        }
      },
      endTime: {
        optional: true,
        isISO8601: {
          errorMessage: COMMON.END_TIME_INVALID
        }
      }
    },
    ['query']
  )
)

module.exports = {
  getStatsValidator
}
