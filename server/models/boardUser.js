const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const User = require('./user')
const Board = require('./board')

const BoardUser = sequelize.define(
  'board_user',
  {
    board_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Board,
        key: 'board_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'board_user',
    timestamps: true,
  }
)

BoardUser.belongsTo(Board, { foreignKey: 'board_id' })
BoardUser.belongsTo(User, { foreignKey: 'user_id' })

module.exports = BoardUser
