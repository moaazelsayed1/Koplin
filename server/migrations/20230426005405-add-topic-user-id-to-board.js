'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'topic_user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'topic_user',
        key: 'topic_user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'topic_user_id')
  },
}
