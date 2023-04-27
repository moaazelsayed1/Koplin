'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Tasks', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'Task_created_by_fkey',
      references: {
        table: 'Users',
        field: 'user_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Tasks', 'Task_created_by_fkey')
  },
}
