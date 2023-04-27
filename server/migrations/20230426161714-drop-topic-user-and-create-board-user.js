'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        'Boards',
        'Boards_topic_user_id_fkey',
        { transaction: t }
      )

      await queryInterface.dropTable('topic_user', { transaction: t })

      await queryInterface.createTable(
        'board_user',
        {
          board_user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          board_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Boards',
              key: 'board_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        },
        { transaction: t }
      )
      await queryInterface.addColumn(
        'Tasks',
        'board_user_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'board_user',
            key: 'board_user_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        { transaction: t }
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('Tasks', 'board_user_id', {
        transaction: t,
      })
      await queryInterface.dropTable('board_user', { transaction: t })

      await queryInterface.createTable(
        'topic_user',
        {
          topic_user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          topic_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Topics',
              key: 'topic_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        },
        { transaction: t }
      )

      await queryInterface.addConstraint('Boards', {
        fields: ['topic_user_id'],
        type: 'foreign key',
        name: 'Boards_topic_user_id_fkey',
        references: {
          table: 'topic_user',
          field: 'topic_user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t,
      })
    })
  },
}
