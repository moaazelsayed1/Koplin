const path = require('path')
const Topic = require(path.join(__dirname, '..', 'models', 'topic'))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getAllTopics = Factory.getAll(Topic)

exports.createTopic = Factory.createOne(Topic)

exports.getTopicById = Factory.getOne(Topic)

exports.updateTopic = Factory.updateOne(Topic)

exports.deleteTopic = Factory.deleteOne(Topic)
