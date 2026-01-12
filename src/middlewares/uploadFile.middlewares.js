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
const resizeCampaignMedia = async (req, res, next) => {
  if (!req.files.length) return next()
  await Promise.all(
    req.files.map(async (file) => {
      if (file.mimetype.startsWith('image')) {
        file.filename = `campaign-media-${v4()}.jpeg`
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

const resizeImagesComment = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next()
  await Promise.all(
    req.files.map(async (file) => {
      if (file.mimetype.startsWith('image')) {
        file.filename = `comment-${v4()}.jpeg`
        file.buffer = await sharp(file.buffer)
          .resize({ width: 200, height: 200, fit: 'cover' })
          .toFormat('jpeg')
          .jpeg({ quality: 100 })
          .toBuffer()
      }
    })
  )
  next()
}

const resizeImageMessage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next()
  await Promise.all(
    req.files.map(async (file) => {
      if (file.mimetype.startsWith('image')) {
        file.filename = `message-${v4()}.jpeg`
        file.buffer = await sharp(file.buffer)
          .resize({ width: 200, height: 200, fit: 'cover' })
          .toFormat('jpeg')
          .jpeg({ quality: 100 })
          .toBuffer()
      }
    })
  )
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
const multerCampaignMedia = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 30 // 30MB
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

const multerMediaMessage = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image',
      'video',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip'
    ]
    const isValid = allowedTypes.some((type) => file.mimetype.startsWith(type))
    if (isValid) {
      cb(null, true)
    } else {
      cb(new AppError('Unsupported file type', HTTP_STATUS.BAD_REQUEST), false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50
  }
})

const uploadOrgAvatar = multerOrgAvatar.single('file')
const uploadOrgMedia = multerOrgMedia.array('files', 5)
const uploadCampaignMedia = multerCampaignMedia.array('files', 10)
const uploadAvatar = multerAvatar.single('file')
const uploadIconFundCategory = multerIconFundCategory.single('file')
const uploadBannerFund = multerBannerFund.single('file')
const uploadMediaFund = multerMediaFund.array('files', 10)
const uploadImagesComment = multerMediaFund.array('files', 4)
const uploadImagesMessage = multerMediaMessage.array('files', 5)

module.exports = {
  renameVideo,
  resizeOrgAvatar,
  resizeOrgMedia,
  resizeCampaignMedia,
  resizeAvatar,
  resizeIconFundCategory,
  resizeBannerFund,
  resizeImagesFund,
  resizeImagesComment,
  resizeImageMessage,

  uploadOrgAvatar,
  uploadOrgMedia,
  uploadCampaignMedia,
  uploadAvatar,
  uploadBannerFund,
  uploadIconFundCategory,
  uploadMediaFund,
  uploadImagesComment,
  uploadImagesMessage
}
