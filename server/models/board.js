const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const Topic = require('./topic')
const topicUser = require('./topicUser')

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
  topic_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: topicUser,
      key: 'topic_user_id',
    },
  },
})

module.exports = Board
