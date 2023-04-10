const path = require('path')
const express = require('express')
const app = express()

// middleware
const userRouter = require(path.join(__dirname, 'routes', 'userRoutes'))
const taskRouter = require(path.join(__dirname, 'routes', 'taskRoutes'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)

// routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app
