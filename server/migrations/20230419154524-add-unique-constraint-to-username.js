'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
      type: 'unique',
      fields: ['username'],
      name: 'unique_username_constraint',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'unique_username_constraint')
  },
}
