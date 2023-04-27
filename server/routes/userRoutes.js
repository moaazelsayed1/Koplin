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

router.post(
  '/signup',
  userController.checkPhoto,
  userController.uploadUserPhotoToCloudinary,
  authController.signup
)

router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
)

router.post('/forgotPassword', authController.forgotPassword)

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUserById
)

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.uploadUserPhotoToCloudinary,
  userController.updateMe
)

router.get(
  '/topic/:id/users',
  authController.protect,
  userController.getUsersByTopic
)

router.get(
  '/board/:id/users',
  authController.protect,
  userController.getUsersByBoard
)

router.get('/:username', userController.getUserByUsername)

// unused
router.get('/', userController.getAllUsers)
// unused
/* router.get('/:id', userController.getUserById) */

// unsed
/* router.post( */
/*   '/', */
/*   userController.checkPhoto, */
/*   userController.uploadUserPhotoToCloudinary, */
/*   userController.createUser */
/* ) */

// unsed
/* router.patch('/:id', userController.updateUser) */

// unused
/* router.delete('/:id', userController.deleteUser) */

module.exports = router
