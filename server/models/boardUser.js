const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const User = require('./user')
const Board = require('./board')

const BoardUser = sequelize.define(
  'board_user',
  {
    board_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'board_user',
  }
)

BoardUser.belongsTo(Board, { foreignKey: 'board_id' })
BoardUser.belongsTo(User, { foreignKey: 'user_id' })

module.exports = BoardUser
