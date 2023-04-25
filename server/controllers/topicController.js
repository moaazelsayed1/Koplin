const path = require('path')
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const Topic_User = require(path.join(__dirname, '..', 'models', 'topicUser'))

exports.addUserToTopic = catchAsync(async (req, res) => {
  const { topicId, userId } = req.params
  const topicUser = await Topic_User.create({
    topic_id: topicId,
    user_id: userId,
  })
  res.status(201).json({
    status: 'success',
    data: {
      topicUser,
    },
  })
})

exports.getTopicsByUser = catchAsync(async (req, res) => {
  console.log(req.user)
  const userId = req.user.user_id

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
  req.body.created_by = req.user.user_id
  next()
}

exports.checkUserInTopic = catchAsync(async (req, res, next) => {
  const topicId = req.params.topicId
  const userId = req.user.user_id

  const topicUser = await Topic_User.findOne({
    where: {
      topic_id: topicId,
      user_id: userId,
    },
  })

  if (!topicUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'User is not authorized to access this topic',
    })
  }

  next()
})

exports.checkTopicOwner = catchAsync(async (req, res, next) => {
  const topic = await Topic.findByPk(req.params.id)

  if (!topic) {
    return res.status(404).json({
      status: 'fail',
      message: 'Topic not found',
    })
  }

  if (topic.created_by !== req.user.user_id) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to perform this action',
    })
  }

  next()
})

exports.getAllTopics = Factory.getAll(Topic)

exports.createTopic = Factory.createOne(Topic)

exports.getTopicById = Factory.getOne(Topic)

exports.updateTopic = Factory.updateOne(Topic)

exports.deleteTopic = Factory.deleteOne(Topic)
