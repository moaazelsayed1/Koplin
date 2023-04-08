const express = require('express')
const dotenv = require('dotenv')
const { Sequelize } = require('sequelize')

const app = require('./index')
dotenv.config()

// Initialize a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
