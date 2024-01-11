'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('manager_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cxc_manager_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'admin_user', key: 'id' },
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
      phone_number: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      is_verify: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      trade: {
        type: Sequelize.STRING
      },
      recording: {
        type: Sequelize.ENUM('0','1'),
        comment: "0 => disabled, 1 => enabled"
      },
      sms: {
        type: Sequelize.ENUM('0','1'),
        comment: "0 => disabled, 1 => enabled",
        defaultValue:false
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
    await queryInterface.dropTable('manager_users');
  }
};