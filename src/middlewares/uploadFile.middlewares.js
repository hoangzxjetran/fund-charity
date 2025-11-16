const multer = require('multer')
const sharp = require('sharp')
const { v4 } = require('uuid')
const { AppError } = require('../controllers/error.controllers.js')
const HTTP_STATUS = require('../constants/httpStatus.js')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image or video! Please upload only images or videos', HTTP_STATUS.BAD_REQUEST), false)
  }
}

const resizeOrgAvatar = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `org-${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 400, height: 400, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toBuffer()
  next()
}

const resizeOrgMedia = async (req, res, next) => {
  if (!req.files.length) return next()
  await Promise.all(
    req.files.map(async (file) => {
      if (file.mimetype.startsWith('image')) {
        file.filename = `org-media-${v4()}.jpeg`
        file.buffer = await sharp(file.buffer)
          .resize({ width: 100, height: 100, fit: 'cover' })
          .toFormat('jpeg')
          .jpeg({ quality: 100 })
          .toBuffer()
      }
    })
  )
  next()
}

const resizeAvatar = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `user-${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 100, height: 100, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toBuffer()
  next()
}

const resizeIconFundCategory = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `fund-categories-${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 20, height: 20, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toBuffer()
  next()
}

const resizeBannerFund = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `fund-banner-${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toBuffer()
  next()
}

const resizeImagesFund = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next()
  await Promise.all(
    req.files.map(async (file) => {
      if (file.mimetype.startsWith('image')) {
        file.filename = `fund-media-${v4()}.jpeg`
        file.buffer = await sharp(file.buffer)
          .resize({ width: 400, height: 400, fit: 'cover' })
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer()
      }
    })
  )
  next()
}

const resizeImageRestaurant = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 500, height: 500, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
  next()
}

const resizeImageReview = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 300, height: 300, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
  next()
}

const resizeImageMenu = async (req, res, next) => {
  if (!req.file) return next()
  if (req.file.mimetype.startsWith('video')) {
    return next()
  }
  req.file.filename = `${v4()}.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 300, height: 300, fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
  next()
}

const renameVideo = (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('video')) {
    return next()
  }
  const type = req.file.mimetype.split('/')[1]
  req.file.filename = `${v4()}.${type}`

  next()
}

const multerOrgAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
})
const multerOrgMedia = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
})
const multerAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
})
const multerIconFundCategory = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
})

const multerBannerFund = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 20MB
  }
})
const multerMediaFund = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 30 // 50MB
  }
})
const multerRestaurant = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
})
const multerMenu = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
})
const uploadRestaurant = multerRestaurant.single('file')

const multerReview = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
})

const uploadOrgAvatar = multerOrgAvatar.single('file')
const uploadOrgMedia = multerOrgMedia.array('files', 5)
const uploadAvatar = multerAvatar.single('file')
const uploadIconFundCategory = multerIconFundCategory.single('file')
const uploadBannerFund = multerBannerFund.single('file')
const uploadMediaFund = multerMediaFund.array('files', 10)
const uploadReview = multerReview.single('file')
const uploadMenu = multerMenu.single('file')

module.exports = {
  renameVideo,
  resizeOrgAvatar,
  resizeOrgMedia,
  resizeAvatar,
  resizeIconFundCategory,
  resizeBannerFund,
  resizeImagesFund,
  resizeImageMenu,
  resizeImageRestaurant,
  resizeImageReview,
  uploadOrgAvatar,
  uploadOrgMedia,
  uploadAvatar,
  uploadBannerFund,
  uploadIconFundCategory,
  uploadMediaFund,
  uploadMenu,
  uploadRestaurant,
  uploadReview
}
