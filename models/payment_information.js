'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment_information.init({
    user_id: DataTypes.INTEGER,
    userType: DataTypes.ENUM('0', '1'),
    cardType: DataTypes.ENUM('0', '1'),
    nameOnCard: DataTypes.STRING,
    card_number: DataTypes.BIGINT,
    expiry: DataTypes.STRING,
    cvv: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment_details',
  });
  return payment_information;
};