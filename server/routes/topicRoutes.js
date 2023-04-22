const path = require('path')
const express = require('express')
const topicController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'topicController'
))
const authController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'authController'
))

const router = express.Router()

router.get('/:topicId/user/:userId', topicController.addUserToTopic)

router.get('/:userId/topics', topicController.getTopicsByUser)

router.get('/', topicController.getAllTopics)

router.get('/:id', topicController.getTopicById)

router.post(
  '/',
  authController.protect,
  topicController.setCreator,
  topicController.createTopic
)

router.put('/:id', topicController.updateTopic)

router.delete('/:id', topicController.deleteTopic)

module.exports = router
