const path = require('path')
const express = require('express')
const taskController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'taskController'
))

const router = express.Router()

router.get('/', taskController.getAllTasks)

router.get('/:id', taskController.getTaskById)

router.post('/', taskController.createTask)

router.put('/:id', taskController.updateTask)

router.delete('/:id', taskController.deleteTask)

module.exports = router
