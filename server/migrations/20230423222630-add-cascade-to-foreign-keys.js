'use strict'

/** @type {import('sequelize-cli').Migration} */
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint if it exists
    await queryInterface.removeConstraint(
      'Task_Comments',
      'Task_Comments_task_id_fkey'
    )

    // Add the foreign key constraint
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

    // Add the foreign key constraint for tasks
    await queryInterface.removeConstraint('Tasks', 'Tasks_board_id_fkey')
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

    // Add the foreign key constraint for boards
    await queryInterface.removeConstraint('Boards', 'Boards_topic_id_fkey')

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
    // Remove the foreign key constraints in reverse order
    await queryInterface.removeConstraint('Boards', 'Boards_topic_id_fkey')
    await queryInterface.removeConstraint('Tasks', 'Tasks_board_id_fkey')
    await queryInterface.removeConstraint(
      'Task_Comments',
      'Task_Comments_task_id_fkey'
    )
  },
}
