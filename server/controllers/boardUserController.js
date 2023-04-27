const path = require('path')
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.setBoardUserId = catchAsync(async (req, res, next) => {
  const { topicId } = req.params
  const user_id = req.user.dataValues.user_id

  req.body.created_by = user_id
  req.body.topic_id = topicId

  next()
})
