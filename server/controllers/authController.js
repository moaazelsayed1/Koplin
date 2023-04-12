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
