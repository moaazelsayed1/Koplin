const path = require('path')
const express = require('express')
const taskController = require('../controllers/taskController')
const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))
const topicUserController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'topicUserController'
))
const router = express.Router()

// unused
router.get('/', taskController.getAllTasks)

// unused
/* router.get('/:id', taskController.getTaskById) */

router.use(authController.protect)
router.get('/myTasks', taskController.getTasksByUser)

router.get(
  '/topic/:topicId/board/:boardId',
  topicUserController.setTopicUserId,
  taskController.getTasksByBoard
)
router.post(
  '/topic/:topicId/',
  topicUserController.setTopicUserId,
  taskController.createTask
)

router
  .route('/topic/:topicId/task/:id')
  .patch(topicUserController.setTopicUserId, taskController.updateTask)
  .delete(topicUserController.setTopicUserId, taskController.deleteTask)

module.exports = router
