const express = require('express')
const app = require('./index')
const path = require('path')
const io = require('./socket')
const http = require('http')

const sequelize = require(path.join(__dirname, 'utils', 'database'))

const port = process.env.PORT || 3000
const server = http.createServer(app)
io.attach(server)

sequelize
  .sync()
  .then(() => console.log('tables created successfully'))
  .catch((error) => console.log('Error creating User table:', error))

server.listen(port, () => {
  console.log('Server listening on port ' + port)
})
