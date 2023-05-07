const path = require('path')
const express = require('express')
const notificationController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'notificationController'
))

const router = express.Router()

router.get('/', notificationController.getAllNotifications)

module.exports = router
