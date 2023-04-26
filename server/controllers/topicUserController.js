const path = require('path')
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const TopicUser = require(path.join(__dirname, '..', 'models', 'topicUser'))

exports.setTopicUserId = catchAsync(async (req, res, next) => {
  const { topicId } = req.params
  const user_id = req.user.dataValues.user_id

  const topicUser = await TopicUser.findOne({
    where: {
      topic_id: topicId,
      user_id: user_id,
    },
  })

  if (!topicUser) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have access to this topic',
    })
  }

  req.body.topic_user_id = topicUser.dataValues.topic_user_id
  req.body.topic_id = topicId

  next()
})
