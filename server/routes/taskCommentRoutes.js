const path = require('path')
const express = require('express')
const taskCommentController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'taskCommentController'
))

const router = express.Router()

router.get('/task/:taskId', taskCommentController.getAllCommentsByTask)

router.get('/', taskCommentController.getAllTaskComments)

router.get('/:id', taskCommentController.getTaskCommentById)

router.post('/', taskCommentController.createTaskComment)

router.put('/:id', taskCommentController.updateTaskComment)

router.delete('/:id', taskCommentController.deleteTaskComment)

module.exports = router
