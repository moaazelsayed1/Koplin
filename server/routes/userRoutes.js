const path = require('path')
const express = require('express')
const userController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'userController'
))

const authController = require(path.join(
  path.join(__dirname, '..', 'controllers', 'authController')
))

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
)

router.post('/forgotPassword', authController.forgotPassword)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

router.post('/', userController.createUser)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

module.exports = router
