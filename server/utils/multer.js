const path = require('path')
const multer = require('multer')
const Datauri = require('datauri/parser')

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false)
  }
}

const multerStorage = multer.memoryStorage()

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

const dUri = new Datauri()
const dataUri = (req) => {
  if (req.photo) {
    const str = req.photo.toString('base64')

    const buffer = Buffer.from(str, 'base64')
    /* console.log(req.photo) */
    return dUri.format('.jpeg', buffer)
  }
  /* console.log(req.file.buffer) */
  return dUri.format('.jpeg', req.file.buffer)
}
module.exports = { upload, dataUri }
