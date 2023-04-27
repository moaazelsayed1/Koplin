const path = require('path')
const AppError = require('../utils/appError')
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const Topic_User = require(path.join(__dirname, '..', 'models', 'topicUser'))

exports.getTopicsByUser = catchAsync(async (req, res) => {
  const userId = req.user.dataValues.user_id

  const topicUsers = await Topic_User.findAll({
    where: { user_id: userId },
    include: [{ model: Topic }],
  })

  const topics = topicUsers.map((tu) => tu.Topic)

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: {
      topics,
    },
  })
})

exports.setCreator = (req, res, next) => {
  req.body.created_by = req.user.dataValues.user_id
  next()
}

exports.checkTopicOwner = catchAsync(async (req, res, next) => {
  const topic = await Topic.findByPk(req.params.id)

  if (!topic) {
    return res.status(404).json({
      status: 'fail',
      message: 'Topic not found',
    })
  }

  if (topic.created_by !== req.user.dataValues.user_id) {
    return next(
      new AppError('You are not authorized to perform this action'),
      403
    )
  }

  next()
})

exports.getAllTopics = Factory.getAll(Topic)

exports.createTopic = Factory.createOne(Topic)

exports.getTopicById = Factory.getOne(Topic)

exports.updateTopic = Factory.updateOne(Topic)

exports.deleteTopic = Factory.deleteOne(Topic)
