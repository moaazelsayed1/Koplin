'use strict'

const { JSONCookie } = require('cookie-parser')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'board_user_id')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'board_user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'board_user',
        key: 'board_user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },
}
