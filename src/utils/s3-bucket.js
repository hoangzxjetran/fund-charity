const { DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const { config } = require('dotenv')
const HTTP_STATUS = require('../constants/httpStatus.js')
const { mediaType } = require('../constants/enum.js')
config()
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const uploadFileToS3 = async (params) => {
  const isVideo = params.ContentType?.startsWith('video')
  const upload = new Upload({
    client: s3Client,
    params,
    ...(isVideo && {
      partSize: 5 * 1024 * 1024,
      queueSize: 4
    })
  })
  await upload.done()
  const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
  return {
    mediaType: isVideo ? mediaType.Video : mediaType.Image,
    url: fileUrl
  }
}
const deleteImageFromS3 = async (key) => {
  const url = new URL(key)
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: url.pathname.slice(1)
  })
  const result = await s3Client.send(command)
  return result.$metadata.httpStatusCode === HTTP_STATUS.NO_CONTENT
}
module.exports = { deleteImageFromS3, uploadFileToS3 }
