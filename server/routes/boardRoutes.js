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

const topicUserController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'topicUserController'
))

const router = express.Router()

// unused
router.get('/', boardController.getAllBoards)

router.use(authController.protect)

router
  .route('/topic/:topicId')
  .get(topicUserController.setTopicUserId, boardController.getAllBoardsByTopic)
  .post(topicUserController.setTopicUserId, boardController.createBoard)

router
  .route('/topic/:topicId/board/:id')
  .get(topicUserController.setTopicUserId, boardController.getBoardById)
  .patch(topicUserController.setTopicUserId, boardController.updateBoard)
  .delete(topicUserController.setTopicUserId, boardController.deleteBoard)

// TODO => all boards of a user (maybe later)

module.exports = router
