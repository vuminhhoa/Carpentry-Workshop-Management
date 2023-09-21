"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timekeeping_Log extends Model {
    static associate(models) {
      Timekeeping_Log.belongsTo(models.Timekeeping_Log_Status, { foreignKey: "status_id" });
      Timekeeping_Log.hasMany(models.Timekeeping_Log_Timekeeping_Log, {
        foreignKey: "Timekeeping_Log_id",
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
