const path = require('path')
const AppError = require(path.join(__dirname, '..', 'utils', 'appError'))

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDoublicateDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Dublicate field value: ${value} please use another value!`
  return new AppError(message, 400)
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  console.log(message)
  return new AppError(message, 400)
}

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token please log in again', 401)
}

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired please log in again', 401)
}
const devError = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const prodError = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  })
}

module.exports = (err, req, res, next) => {
  console.log(err.stack)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    devError(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message
    if (err.name === 'CastError') error = handleCastErrorDB(error)
    if (err.code === 11000) error = handleDoublicateDB(error)
    if (err.name === 'ValidationError') error = handleValidationError(error)
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError()
    if (err.name === 'JWTExpiredError') error = handleJWTExpiredError()

    prodError(error, req, res)
  }
}
