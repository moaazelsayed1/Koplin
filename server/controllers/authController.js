const jwt = require('jsonwebtoken')
const path = require('path')

const appError = require(path.join('..', 'utils', 'appError'))
const catchAsync = require(path.join('..', 'utils', 'catchAsync'))
const User = require(path.join('..', 'models', 'user'))
const sendEmail = require(path.join('..', 'utils', 'email'))

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
  console.log(req.user)
  next()
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.dataValues.user_id)

  if (!user) {
    return next(new appError('You are not logged in.', 401))
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new appError('Your current password is wrong.', 401))
  }

  user.password = req.body.password
  await user.save()

  createAndSendToken(user, 200, res)
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return next(new appError('There is no user with email address', 404))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      text: message,
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    )
  }
})
