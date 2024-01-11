'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      is_verify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      client_id: {
        type: Sequelize.INTEGER
      },
      client_secret: {
        type: Sequelize.STRING
      },
      tenant_id: {
        type: Sequelize.INTEGER
      },
      app_key: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('admin_users');
  }
};