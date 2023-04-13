const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

// Initialize a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
})

module.exports = sequelize
