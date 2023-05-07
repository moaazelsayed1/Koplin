const path = require('path')
const Notification = require(path.join(
  __dirname,
  '..',
  'models',
  'notification'
))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllNotifications = Factory.getAll(Notification)
