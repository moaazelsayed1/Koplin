const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'utils', 'database'))
const { DataTypes } = require('sequelize')
const User = require('./user')
const Board = require('./board')

const Task = sequelize.define('Task', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0,
  },
  task_title: {
    type: DataTypes.STRING,
    allowNull: false,
    default: 'Untitled',
  },
  task_description: {
    type: DataTypes.TEXT,
    allowNull: false,
    default: 'No description',
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
    default: 'To Do',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    refernces: {
      model: 'User',
      key: 'user_id',
    },
  },
})

Task.belongsTo(Board, { foreignKey: 'board_id' })
Task.belongsTo(User, { foreignKey: 'assignee_id' })

module.exports = Task
