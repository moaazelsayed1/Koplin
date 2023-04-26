const path = require('path')
const Board = require(path.join(__dirname, '..', 'models', 'board'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))
const AppError = require(path.join(__dirname, '..', 'utils', 'appError'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))

exports.getAllBoardsByTopic = catchAsync(async (req, res, next) => {
  const { topicId } = req.params

  const topic = await Topic.findByPk(topicId)

  if (!topic) {
    return next(new AppError('No topic found with that ID', 404))
  }

  const boards = await Board.findAll({ where: { topic_id: topicId } })

  res.status(200).json({
    status: 'success',
    results: boards.length,
    data: {
      boards,
    },
  })
})

exports.getAllBoards = Factory.getAll(Board)

exports.createBoard = Factory.createOne(Board)

exports.getBoardById = Factory.getOne(Board)

exports.updateBoard = Factory.updateOne(Board)

exports.deleteBoard = Factory.deleteOne(Board)
