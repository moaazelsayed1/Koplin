const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'user'))
const TopicUser = require(path.join(__dirname, '..', 'models', 'topicUser'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const cloudinary = require(path.join(__dirname, '..', 'utils', 'cloudinary'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const { createCanvas, loadImage } = require('canvas')
const { upload, dataUri } = require(path.join(
  __dirname,
  '..',
  'utils',
  'multer'
))

const sharp = require('sharp')

const generateDefaultUserPhoto = catchAsync(async (req, res, next) => {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')

  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  ctx.fillStyle = `rgb(${r},${g},${b})`
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = '100px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'

  const initial = req.body.username.charAt(0).toUpperCase()
  ctx.fillText(initial, canvas.width / 2, canvas.height / 2)

  const buffer = canvas.toBuffer()
  req.photo = buffer.toString('base64')

  next()
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.dataValues.user_id
  next()
}

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()

  next()
})

exports.uploadUserPhotoToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.file && !req.photo) return next()

  const file = dataUri(req).content

  const result = await cloudinary.uploader.upload(file)

  req.body.photo = result.secure_url

  next()
})

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  const user = await User.findByPk(req.user.dataValues.user_id)

  const fields = {
    username: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
  }
  const updatedUser = await user.update(fields)

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

// log in
exports.getUsersByTopic = catchAsync(async (req, res, next) => {
  const topicId = req.params.id

  const topicUsers = await TopicUser.findAll({
    where: { topic_id: topicId },
    include: [{ model: User }],
  })

  const users = topicUsers.map((topicUser) => topicUser.User)

  res.status(200).json({ status: 'success', data: { users } })
})

exports.checkPhoto = (req, res, next) => {
  if (!req.photo) {
    return generateDefaultUserPhoto(req, res, next)
  }
}

exports.getAllUsers = Factory.getAll(User)

exports.createUser = Factory.createOne(User)

exports.getUserById = Factory.getOne(User)

exports.updateUser = Factory.updateOne(User)

exports.deleteUser = Factory.deleteOne(User)
