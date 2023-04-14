const path = require('path')
const TaskComment = require(path.join(__dirname, '..', 'models', 'taskComment'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getAllCommentsByTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.taskId
  const comments = await TaskComment.findAll({
    where: {
      task_id: taskId,
    },
  })
  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  })
})

exports.getAllTaskComments = Factory.getAll(TaskComment)

exports.createTaskComment = Factory.createOne(TaskComment)

exports.getTaskCommentById = Factory.getOne(TaskComment)

exports.updateTaskComment = Factory.updateOne(TaskComment)

exports.deleteTaskComment = Factory.deleteOne(TaskComment)
