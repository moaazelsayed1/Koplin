const express = require('express')
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app
