'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint for Task_Comments table
    await queryInterface.addConstraint('Task_Comments', {
      fields: ['task_id'],
      type: 'foreign key',
      name: 'Task_Comments_task_id_fkey',
      references: {
        table: 'Tasks',
        field: 'task_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })

    // Add foreign key constraint for Tasks table
    await queryInterface.addConstraint('Tasks', {
      fields: ['board_id'],
      type: 'foreign key',
      name: 'Tasks_board_id_fkey',
      references: {
        table: 'Boards',
        field: 'board_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })

    // Add foreign key constraint for Boards table
    await queryInterface.addConstraint('Boards', {
      fields: ['topic_id'],
      type: 'foreign key',
      name: 'Boards_topic_id_fkey',
      references: {
        table: 'Topics',
        field: 'topic_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraint for Task_Comments table
    await queryInterface.removeConstraint(
      'Task_Comments',
      'Task_Comments_task_id_fkey'
    )

    // Remove foreign key constraint for Tasks table
    await queryInterface.removeConstraint('Tasks', 'Tasks_board_id_fkey')

    // Remove foreign key constraint for Boards table
    await queryInterface.removeConstraint('Boards', 'Boards_topic_id_fkey')
  },
}
