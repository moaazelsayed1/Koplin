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

Topic.afterCreate(async (topic, options) => {
  const Topic_User = require('./topicUser')
  await Topic_User.create({
    topic_id: topic.topic_id,
    user_id: topic.created_by,
  })
})

module.exports = Topic
