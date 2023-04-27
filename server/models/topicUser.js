const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')
const User = require(path.join('..', 'models', 'user'))
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))

const TopicUser = sequelize.define(
  'topic_user',
  {
    topic_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'topic_user',
  }
)

TopicUser.belongsTo(User, { foreignKey: 'user_id' })
TopicUser.belongsTo(Topic, { foreignKey: 'topic_id' })

module.exports = TopicUser
