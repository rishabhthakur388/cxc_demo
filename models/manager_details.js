'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class manager_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      manager_details.belongsTo(models.manager_user, {
        foreignKey: "id"
      });
      manager_details.belongsTo(models.manager_user, {
        foreignKey: "id"
      });
    }
  }
  manager_details.init({
    manager_id: DataTypes.INTEGER,
    profile_picture: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    recording: DataTypes.STRING,
    sms: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'manager_details',
  });
  return manager_details;
};