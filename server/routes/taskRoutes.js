const path = require('path')
const express = require('express')
const taskController = require('../controllers/taskController')
const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))
const router = express.Router()

router.get('/board/:boardId', taskController.getTasksByBoard)

router.get('/myTasks', authController.protect, taskController.getTasksByUser)

router.get('/', taskController.getAllTasks)

router.get('/:id', taskController.getTaskById)

router.post('/', taskController.createTask)

router.put('/:id', taskController.updateTask)

router.delete('/:id', taskController.deleteTask)

module.exports = router
