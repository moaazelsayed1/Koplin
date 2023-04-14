const path = require('path')
const Task = require(path.join(__dirname, '..', 'models', 'task'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getTasksByUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId
  const tasks = await Task.findAll({
    where: {
      assignee_id: userId,
    },
  })
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  })
})

exports.getAllTasks = Factory.getAll(Task)

exports.createTask = Factory.createOne(Task)

exports.getTaskById = Factory.getOne(Task)

exports.updateTask = Factory.updateOne(Task)

exports.deleteTask = Factory.deleteOne(Task)
