const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'user'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll()
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  })
})

exports.createUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body

  const user = await User.create({
    username,
    email,
    password,
  })

  res.status(201).json({
    status: 'success',
    data: user,
  })
})

exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id)

  res.status(200).json({
    status: 'success',
    data: user,
  })
})

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    })
  }
  console.log(user)
  await user.update(req.body)
  res.status(200).json({
    status: 'success',
    data: user,
  })
})

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    })
  }
  await user.destroy()
  res.status(204).json({
    status: 'success',
  })
})
