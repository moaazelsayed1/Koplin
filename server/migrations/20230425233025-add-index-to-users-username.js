'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Users', ['username'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Users', ['username'])
  },
}
