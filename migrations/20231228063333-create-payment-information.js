'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_informations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userType: {
        type: Sequelize.ENUM('0','1'),
        comment: '0 => Admin, 1 => Manager',
        allowNull:false
      },
      cardType: {
        type: Sequelize.ENUM('0','1'),
        comment: '0 => creditCard, 1 => debitCard'
      },
      nameOnCard: {
        type: Sequelize.STRING
      },
      card_number: {
        type: Sequelize.BIGINT
      },
      expiry: {
        type: Sequelize.STRING
      },
      cvv: {
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
    await queryInterface.dropTable('payment_informations');
  }
};