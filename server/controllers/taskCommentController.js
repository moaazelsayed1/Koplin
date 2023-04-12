const path = require('path')
const TaskComment = require(path.join(__dirname, '..', 'models', 'taskComment'))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllTaskComments = Factory.getAll(TaskComment)

exports.createTaskComment = Factory.createOne(TaskComment)

exports.getTaskCommentById = Factory.getOne(TaskComment)

exports.updateTaskComment = Factory.updateOne(TaskComment)

exports.deleteTaskComment = Factory.deleteOne(TaskComment)
