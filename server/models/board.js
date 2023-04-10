const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const Topic = require('./topic')

const Board = sequelize.define('Board', {
  board_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  board_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  board_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: 'topic_id',
    },
  },
})

Board.belongsTo(Topic, { foreignKey: 'topic_id' })

module.exports = Board