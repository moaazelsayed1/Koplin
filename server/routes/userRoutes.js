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

router.post('/', userController.createUser)

module.exports = router
