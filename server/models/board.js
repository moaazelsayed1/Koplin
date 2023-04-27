const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const Topic = require('./topic')
const User = require('./user')
const TopicUser = require('./topicUser')

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
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
})

Board.afterCreate(async (board, options) => {
  const Board_User = require('./boardUser')
  await Board_User.create({
    board_id: board.board_id,
    user_id: board.created_by,
  })

  const topicUser = await TopicUser.findOne({
    where: {
      user_id: board.created_by,
    },
  })
  if (!topicUser) {
    await TopicUser.create({
      user_id: board.created_by,
      topic_id: board.topic_id,
    })
  }
})

module.exports = Board
