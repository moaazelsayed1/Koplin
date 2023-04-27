'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'assignee_id')
    await queryInterface.removeColumn('Tasks', 'board_id')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'assignee_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    })
    await queryInterface.addColumn('Tasks', 'board_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Boards',
        key: 'board_id',
      },
    })
  },
}
