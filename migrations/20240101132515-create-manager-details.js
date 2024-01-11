'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('manager_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      manager_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'manager_user', key: 'id' },
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      sms: {
        type: Sequelize.STRING
      },
      recording: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('manager_details');
  }
};