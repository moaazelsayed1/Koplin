const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const User = require('./user')
const Topic = require('./topic')

const Topic_User = sequelize.define(
  'Topic_User',
  {
    topic_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'topic_user',
  }
)

Topic_User.belongsTo(Topic, { foreignKey: 'topic_id' })
Topic_User.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Topic_User
