const path = require('path')
const express = require('express')
const boardController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'boardController'
))

const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))

const boardUserController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'boardUserController'
))

const router = express.Router()

// unused
router.get('/', boardController.getAllBoards)

router.use(authController.protect)

router
  .route('/topic/:topicId')
  .get(boardUserController.setBoardUserId, boardController.getAllBoardsByTopic)
  .post(boardUserController.setBoardUserId, boardController.createBoard)

router
  .route('/:id')
  .get(boardController.checkUserInBoard, boardController.getBoardById)
  .patch(boardController.checkBoardCreator, boardController.updateBoard)
  .delete(boardController.checkBoardCreator, boardController.deleteBoard)

router.get(
  '/board/:id/user/:userId',
  boardController.checkUserInBoard,
  boardController.addUserToBoard
)

// TODO => all boards of a user (maybe later)

module.exports = router
