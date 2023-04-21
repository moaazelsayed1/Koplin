const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'user'))
const TopicUser = require(path.join(__dirname, '..', 'models', 'topicUser'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const cloudinary = require(path.join(__dirname, '..', 'utils', 'cloudinary'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const { upload, dataUri } = require(path.join(
  __dirname,
  '..',
  'utils',
  'multer'
))

const sharp = require('sharp')

/* 
if(req.file) {
const file = dataUri(req).content;
return uploader.upload(file).then((result) => {
const image = result.url;
return res.status(200).json({
messge: 'Your image has been uploded successfully to cloudinary',
data: {
image
}
*/
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
  if (!req.file) return next()

  const file = dataUri(req).content
  /* console.log(file) */
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

exports.getUsersByTopic = catchAsync(async (req, res, next) => {
  const topicId = req.params.id

  const topicUsers = await TopicUser.findAll({
    where: { topic_id: topicId },
    include: [{ model: User }],
  })

  const users = topicUsers.map((topicUser) => topicUser.User)

  res.status(200).json({ status: 'success', data: { users } })
})

exports.getAllUsers = Factory.getAll(User)

exports.createUser = Factory.createOne(User)

exports.getUserById = Factory.getOne(User)

exports.updateUser = Factory.updateOne(User)

exports.deleteUser = Factory.deleteOne(User)
