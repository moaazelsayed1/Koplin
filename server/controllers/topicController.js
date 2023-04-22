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

exports.getAllTopics = Factory.getAll(Topic)

exports.createTopic = Factory.createOne(Topic)

exports.getTopicById = Factory.getOne(Topic)

exports.updateTopic = Factory.updateOne(Topic)

exports.deleteTopic = Factory.deleteOne(Topic)
