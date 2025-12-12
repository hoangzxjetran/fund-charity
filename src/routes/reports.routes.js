const { Router } = require('express')

const catchAsync = require('../middlewares/catchAsync.middleware')
const { isAuthorized } = require('../middlewares/auth.middlewares')
const {
  createReportValidator,
  getAllReportsValidator,
  updateStatusReportValidator
} = require('../validations/reports.validations')
const reportsControllers = require('../controllers/reports.controllers')

const reportRouter = Router()

reportRouter
  .route('/')
  .post(isAuthorized, createReportValidator, catchAsync(reportsControllers.create))
  .get(isAuthorized, getAllReportsValidator, catchAsync(reportsControllers.getAll))
reportRouter
  .route('/:reportId')
  .post(isAuthorized, updateStatusReportValidator, catchAsync(reportsControllers.updateStatus))

module.exports = reportRouter
