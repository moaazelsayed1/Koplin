const path = require('path')
const Task = require(path.join(__dirname, '..', 'models', 'task'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getTasksByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.dataValues.user_id
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

exports.getTasksByBoard = catchAsync(async (req, res, next) => {
  const boardId = req.params.boardId
  const tasks = await Task.findAll({
    where: {
      board_id: boardId,
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

exports.setBoardId = catchAsync(async (req, res, next) => {
  const userId = req.user.dataValues.user_id

  req.body.created_by = userId
  next()
})
exports.getAllTasks = Factory.getAll(Task)

exports.createTask = Factory.createOne(Task)

exports.getTaskById = Factory.getOne(Task)

exports.updateTask = Factory.updateOne(Task)

exports.deleteTask = Factory.deleteOne(Task)
