const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')
const User = require('./user')

const Topic = sequelize.define('Topic', {
  topic_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  topic_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topic_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

Topic.belongsTo(User, { foreignKey: 'created_by' })

Topic.afterCreate(async (board, options) => {
  const TopicUser = require('./topicUser')
  await TopicUser.create({
    user_id: board.created_by,
    topic_id: board.topic_id,
  })
})

module.exports = Topic
