'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      admin_user.hasMany(models.manager_user, {
        foreignKey: "id"
      })

    }
  }
  admin_user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    username: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    client_secret: DataTypes.STRING,
    tenant_id: DataTypes.INTEGER,
    app_key: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    is_verify: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'admin_user',
  });
  return admin_user;
};