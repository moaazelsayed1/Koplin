const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'user'))
const Factory = require(path.join(__dirname, 'handlerFactory'))

exports.getMe = (req, res, next) => {
  req.params.id = req.user.dataValues.user_id
  next()
}

exports.getAllUsers = Factory.getAll(User)

exports.createUser = Factory.createOne(User)

exports.getUserById = Factory.getOne(User)

exports.updateUser = Factory.updateOne(User)

exports.deleteUser = Factory.deleteOne(User)
