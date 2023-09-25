"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Carpenter_Status extends Model {
    static associate(models) {
      Carpenter_Status.hasMany(models.Carpenter, { foreignKey: "status_id" });
    }
  }
  Carpenter_Status.init(
    {
      name: DataTypes.STRING,
      alias: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Carpenter_Status",
    }
  );
  return Carpenter_Status;
};
