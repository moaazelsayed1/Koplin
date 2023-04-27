'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('topic_user', {
      type: 'unique',
      fields: ['topic_id', 'user_id'],
      name: 'topic_user_topic_id_user_id_key',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'topic_user',
      'topic_user_topic_id_user_id_key'
    )
  },
}
