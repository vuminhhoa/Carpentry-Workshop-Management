"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timekeeping_Log extends Model {
    static associate(models) {
      Timekeeping_Log.hasMany(models.Carpenter_Timekeeping_Log, {
        foreignKey: "timekeeping_log_id",
      });
    }
  }
  Timekeeping_Log.init(
    {
      date: DataTypes.DATE, // đơn vị tính nhập chữ
    },
    {
      sequelize,
      modelName: "Timekeeping_Log",
    }
  );
  return Timekeeping_Log;
};
