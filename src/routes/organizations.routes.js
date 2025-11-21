const express = require('express')
const router = express.Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const OrganizationControllers = require('../controllers/organizations.controllers')
const {
  createOrganizationValidator,
  organizationIdValidator,
  getOrganizationsValidator,
  updateOrganizationValidator
} = require('../validations/organizations.validations')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const {
  uploadOrgAvatar,
  resizeOrgAvatar,
  uploadOrgMedia,
  resizeOrgMedia
} = require('../middlewares/uploadFile.middlewares.js')

router
  .route('/')
  .post(isAuthorized, createOrganizationValidator, catchAsync(OrganizationControllers.createOrganization))
  .get(getOrganizationsValidator, catchAsync(OrganizationControllers.getOrganizations))
router
  .route('/upload-avatar')
  .post(isAuthorized, uploadOrgAvatar, resizeOrgAvatar, catchAsync(OrganizationControllers.uploadOrgAvatar))
router
  .route('/upload-media')
  .post(isAuthorized, uploadOrgMedia, resizeOrgMedia, catchAsync(OrganizationControllers.uploadMedia))
router
  .route('/:orgId')
  .get(organizationIdValidator, catchAsync(OrganizationControllers.getOrganizationById))
  .put(organizationIdValidator, updateOrganizationValidator, catchAsync(OrganizationControllers.updateOrganization))
module.exports = router
