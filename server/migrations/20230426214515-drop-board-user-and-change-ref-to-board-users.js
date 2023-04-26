'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Tasks', 'Tasks_created_by_fkey')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Tasks', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'Task_created_by_fkey',
      references: {
        table: 'board_user',
        field: 'board_user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
}
