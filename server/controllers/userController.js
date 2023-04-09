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
  // Get the user data from the request body
  const { username, email, password } = req.body

  // Create the new user in the database
  const user = await User.create({
    username,
    email,
    password,
  })

  res.status(200).json({
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
