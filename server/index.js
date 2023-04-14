const path = require('path')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(bodyParser.json())

const AppError = require(path.join(__dirname, 'utils', 'appError'))
const globalErrorHandler = require(path.join(
  __dirname,
  'controllers',
  'errorController'
))
const userRouter = require(path.join(__dirname, 'routes', 'userRoutes'))
const taskRouter = require(path.join(__dirname, 'routes', 'taskRoutes'))
const topicRouter = require(path.join(__dirname, 'routes', 'topicRoutes'))
const boardRouter = require(path.join(__dirname, 'routes', 'boardRoutes'))
const taskCommentRouter = require(path.join(
  __dirname,
  'routes',
  'taskCommentRoutes'
))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1/topics', topicRouter)
app.use('/api/v1/boards', boardRouter)
app.use('/api/v1/task-comments', taskCommentRouter)

// routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
