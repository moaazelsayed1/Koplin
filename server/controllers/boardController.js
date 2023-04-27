const path = require('path')
const Board = require(path.join(__dirname, '..', 'models', 'board'))
const Factory = require(path.join(__dirname, 'handlerFactory'))
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))
const AppError = require(path.join(__dirname, '..', 'utils', 'appError'))
const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'))
const BoardUser = require(path.join(__dirname, '..', 'models', 'boardUser'))
const TopicUser = require(path.join(__dirname, '..', 'models', 'topicUser'))

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

exports.checkUserInBoard = catchAsync(async (req, res, next) => {
  const user_id = req.user.dataValues.user_id
  const board_id = req.params.id

  const boardUser = await BoardUser.findOne({
    where: {
      board_id: board_id,
      user_id: user_id,
    },
  })

  if (!boardUser) {
    return next(new AppError('You are not a member in this board', 403))
  }
  next()
})

exports.checkBoardCreator = catchAsync(async (req, res, next) => {
  const user_id = req.user.dataValues.user_id
  const board_id = req.params.id

  const creator = await Board.findOne({
    where: {
      created_by: user_id,
      board_id: board_id,
    },
  })

  if (!creator) {
    return next(new AppError('You can not perform this action!', 403))
  }

  next()
})

exports.addUserToBoard = catchAsync(async (req, res, next) => {
  const user_id = req.user.dataValues.user_id
  const board_id = req.params.id

  const board = await Board.findOne({
    where: {
      board_id: board_id,
    },
  })

  const topicUser = await TopicUser.findOne({
    where: {
      user_id: user_id,
    },
  })
  if (!topicUser) {
    await TopicUser.create({
      user_id: user_id,
      topic_id: board.topic_id,
    })
  }

  const boardUser = await BoardUser.create({
    user_id: user_id,
    board_id: board_id,
  })

  res.status(201).json({
    status: 'success',
    data: {
      boardUser,
    },
  })
})

exports.getAllBoards = Factory.getAll(Board)

exports.createBoard = Factory.createOne(Board)

exports.getBoardById = Factory.getOne(Board)

exports.updateBoard = Factory.updateOne(Board)

exports.deleteBoard = Factory.deleteOne(Board)
