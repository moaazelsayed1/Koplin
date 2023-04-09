const express = require('express')
const app = require('./index')
const path = require('path')

const sequelize = require(path.join(__dirname, 'utils', 'database'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
