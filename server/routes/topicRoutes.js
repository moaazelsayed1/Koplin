const path = require('path')
const express = require('express')
const topicController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'topicController'
))

const router = express.Router()

router.get('/user/:userId', topicController.addUserToTopic)

router.get('/:userId', topicController.getTopicsByUser)

router.get('/', topicController.getAllTopics)

router.get('/:id', topicController.getTopicById)

router.post('/', topicController.createTopic)

router.put('/:id', topicController.updateTopic)

router.delete('/:id', topicController.deleteTopic)

module.exports = router
