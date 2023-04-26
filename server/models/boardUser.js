const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const User = require('./user')
const Board = require('./board')

const Board_User = sequelize.define('Board_User', {
  board_user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
})

Board_User.belongsTo(Board, { foreignKey: 'board_id' })
Board_User.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Board_User
