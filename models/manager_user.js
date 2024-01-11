'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class manager_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      manager_user.belongsTo(models.admin_user,{
        foreignKey:"cxc_manager_id"
      })
      manager_user.hasMany(models.manager_details,{
        foreignKey:"manager_id"
      })

    }
  }
  manager_user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    cxc_manager_id: DataTypes.INTEGER,
    client_id: DataTypes.INTEGER,
    client_secret: DataTypes.STRING,
    tenant_id: DataTypes.INTEGER,
    app_key: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    trade: DataTypes.STRING,
    recording:DataTypes.ENUM('0','1'),
    sms:DataTypes.ENUM('0','1'),
    is_verify: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'manager_user',
  });
  return manager_user;
};