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

// unused
/* router.get('/', topicController.getAllTopics) */

// unused
/* router.get('/:id', topicController.getTopicById) */

router.use(authController.protect)

router.post('/', topicController.setCreator, topicController.createTopic)

router.get('/myTopics', topicController.getTopicsByUser)

router.patch(
  '/:id',
  topicController.checkTopicOwner,
  topicController.updateTopic
)

router.delete(
  '/:id',
  topicController.checkTopicOwner,
  topicController.deleteTopic
)

module.exports = router
