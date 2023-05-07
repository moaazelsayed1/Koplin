const path = require('path')
const Notification = require(path.join(
  __dirname,
  '..',
  'models',
  'notification'
))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllNotifications = Factory.getAll(Notification)

exports.createNotification = Factory.createOne(Notification)

exports.getNotificationById = Factory.getOne(Notification)

exports.updateNotification = Factory.updateOne(Notification)

exports.deleteNotification = Factory.deleteOne(Notification)
