const path = require('path')
const express = require('express')
const taskController = require('../controllers/taskController')
const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))

const boardController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'boardController'
))

const router = express.Router()

// unused
router.get('/', taskController.getAllTasks)

// unused
/* router.get('/:id', taskController.getTaskById) */

router.use(authController.protect)
router.get('/myTasks', taskController.getTasksByUser)

router.get('/board/:boardId', taskController.getTasksByBoard)

router.post('/', taskController.setBoardId, taskController.createTask)

router
  .route('/board/:id/task/:taskId')
  .patch(
    boardController.checkUserInBoard,
    taskController.setTaskId,
    taskController.updateTask
  )
  .delete(
    boardController.checkUserInBoard,
    taskController.setTaskId,
    taskController.deleteTask
  )

module.exports = router
