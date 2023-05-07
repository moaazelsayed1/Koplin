const path = require('path')
const express = require('express')
const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))
const notificationController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'notificationController'
))

const router = express.Router()

router.get(
  '/myNotifications',
  authController.protect,
  notificationController.getNotificationsByUser
)

router.get('/', notificationController.getAllNotifications)

router.get('/:id', notificationController.getNotificationById)

router.post('/', notificationController.createNotification)

router.patch('/:id', notificationController.updateNotification)

router.delete('/:id', notificationController.deleteNotification)

module.exports = router
