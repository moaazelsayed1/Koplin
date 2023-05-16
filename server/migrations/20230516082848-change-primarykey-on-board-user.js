'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('board_user', {
      fields: ['board_id', 'user_id'],
      type: 'primary key',
      name: 'board_user_pkey',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('board_user', 'board_user_pkey')
  },
}
