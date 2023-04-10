const { DataTypes } = require('sequelize')
const sequelize = require('../database')

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
})

module.exports = Topic
