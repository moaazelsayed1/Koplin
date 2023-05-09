const path = require('path')
const http = require('http')
const app = require('./index')
const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: true,
  },
})
const User = require(path.join(__dirname, '.', 'models', 'user'))
const BoardUser = require(path.join(__dirname, '.', 'models', 'boardUser'))
const Board = require(path.join(__dirname, '.', 'models', 'board'))
const Notification = require(path.join(
  __dirname,
  '.',
  'models',
  'notification'
))

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined the room`)
  })

  socket.on('invite', (boardId, invitedUserId, invitingUserId) => {
    sendBoardInvitation(boardId, invitedUserId, invitingUserId)
      .then((response) => {
        io.to(invitedUserId).emit('notification', response)
        console.log(`Notification sent to user ${invitedUserId}`)
      })
      .catch((error) => {
        console.log(`Error sending board invitation: ${error}`)
      })
  })
})

const sendBoardInvitation = async (boardId, invitedUserId, invitingUserId) => {
  const receiverId = invitedUserId
  const boardUser = await BoardUser.findOne({
    where: {
      board_id: boardId,
      user_id: receiverId,
    },
  })

  if (boardUser) {
    return {
      success: false,
      message: 'The user is already a member of the board',
    }
  }

  const invitedUser = await User.findByPk(invitedUserId)
  if (!invitedUser) {
    console.log(`User with id ${invitedUserId} not found`)
    return { success: false, message: 'User not found' }
  }

  const senderId = invitingUserId

  const invitingUser = await User.findByPk(invitingUserId)
  const board = await Board.findByPk(boardId)

  const message = `${invitingUser.username} invited you to board ${board.board_title}`

  await Notification.create({
    senderId,
    receiverId,
    message,
  })

  return { success: true, message }
}

module.exports = io
