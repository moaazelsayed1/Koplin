const jwt = require('jsonwebtoken')
const path = require('path')

const appError = require(path.join('..', 'utils', 'appError'))
const catchAsync = require(path.join('..', 'utils', 'catchAsync'))
const User = require(path.join('..', 'models', 'user'))

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createAndSendToken = (user, userStatus, res) => {
  const token = signToken(user.user_id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions)
  user.password = undefined
  res.status(userStatus).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new appError('Please provide email and password', 400))
  }

  const user = await User.findOne({ where: { email } })

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password', 401))
  }

  createAndSendToken(user, 200, res)

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
})

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  createAndSendToken(newUser, 201, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new appError('You are not logged in! Please log in to get access.', 401)
    )
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  const currentUser = await User.findByPk(decoded.id)

  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password! Please log in again.', 401)
    )
  }

  req.user = currentUser
  next()
})
