const express = require('express')
const app = require('./index')
const path = require('path')
const io = require('./socket')
const http = require('http')

const sequelize = require(path.join(__dirname, 'utils', 'database'))

const port = process.env.PORT || 3000
const server = http.createServer(app)
io.attach(server)

/* sequelize */
/*   .sync() */
/*   .then(() => console.log('tables created successfully')) */
/*   .catch((error) => console.log('Error creating User table:', error)) */

async function createTables() {
  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')

    await sequelize.query('CREATE TABLE IF NOT EXISTS Users (...)', {
      type: sequelize.QueryTypes.RAW,
    })
    console.log('Tables created successfully.')
  } catch (error) {
    console.error('Error creating User table:', error)
  } finally {
    await sequelize.close()
  }
}

createTables()

server.listen(port, () => {
  console.log('Server listening on port ' + port)
})
