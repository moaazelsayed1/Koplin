const path = require('path')
const Notification = require(path.join(
  __dirname,
  '..',
  'models',
  'notification'
))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getNotificationsByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.user_id

  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  const where = { receiverId: userId }
  for (const key in queryObj) {
    where[key] = {
      [Op.eq]: queryObj[key],
    }
  }

  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 50
  const offset = (page - 1) * limit

  const sortOrder = req.query.sort || ''
  let order = []
  if (sortOrder) {
    const sortFields = sortOrder.split(',').map((field) => field.trim())
    order = sortFields.map((field) => {
      if (field.startsWith('-')) {
        return [field.slice(1), 'DESC']
      } else {
        return [field, 'ASC']
      }
    })
  }

  const notifications = await Notification.findAndCountAll({
    where: where,
    order: order,
    offset: offset,
    limit: limit,
  })

  res.status(200).json({
    status: 'success',
    results: notifications.count,
    data: {
      data: notifications.rows,
    },
  })
})

exports.getAllNotifications = Factory.getAll(Notification)

exports.createNotification = Factory.createOne(Notification)

exports.getNotificationById = Factory.getOne(Notification)

exports.updateNotification = Factory.updateOne(Notification)

exports.deleteNotification = Factory.deleteOne(Notification)
