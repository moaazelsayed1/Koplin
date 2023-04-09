const path = require('path')
const express = require('express')
const User = require(path.join(__dirname, '..', 'models', 'user'))
const userController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'userController'
))

const router = express.Router()

// GET /users
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

router.post('/', userController.createUser)

/* router.put('/:id', userController.updateUser) */

/* router.delete('/:id', userController.deleteUser) */
module.exports = router
