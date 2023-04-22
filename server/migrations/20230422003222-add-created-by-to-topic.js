'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Topics', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Topics', 'created_by')
  },
}
