const path = require('path')
const Board = require(path.join(__dirname, '..', 'models', 'board'))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllBoards = Factory.getAll(Board)

exports.createBoard = Factory.createOne(Board)

exports.getBoardById = Factory.getOne(Board)

exports.updateBoard = Factory.updateOne(Board)

exports.deleteBoard = Factory.deleteOne(Board)
