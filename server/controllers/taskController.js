const path = require('path')
const Task = require(path.join(__dirname, '..', 'models', 'task'))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllTasks = Factory.getAll(Task)

exports.createTask = Factory.createOne(Task)

exports.getTaskById = Factory.getOne(Task)

exports.updateTask = Factory.updateOne(Task)

exports.deleteTask = Factory.deleteOne(Task)
