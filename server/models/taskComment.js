const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')

const User = require('./user')
const Board = require('./board')
const Task_Comment = sequelize.define('Task_Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comment_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
})

Task_Comment.belongsTo(Task, { foreignKey: 'task_id' })
Task_Comment.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Task_Comment
