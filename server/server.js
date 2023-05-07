const express = require('express')
const app = require('./index')
const path = require('path')
const io = require('./socket')

const sequelize = require(path.join(__dirname, 'utils', 'database'))

const port = process.env.PORT || 3000

sequelize
  .sync()
  .then(() => console.log('tables created successfully'))
  .catch((error) => console.log('Error creating User table:', error))

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
