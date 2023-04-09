const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'user'))

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

exports.createUser = async (req, res) => {
  try {
    // Get the user data from the request body
    const { username, email, password } = req.body

    // Create the new user in the database
    const user = await User.create({
      username,
      email,
      password,
    })

    // Return the newly created user
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to create user' })
  }
}
