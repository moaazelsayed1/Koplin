const path = require('path')
const express = require('express')
const boardController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'boardController'
))

const router = express.Router()

router.get('/', boardController.getAllBoards)
router.get('/:id', boardController.getBoardById)

router.post('/', boardController.createBoard)

router.put('/:id', boardController.updateBoard)

router.delete('/:id', boardController.deleteBoard)

module.exports = router
