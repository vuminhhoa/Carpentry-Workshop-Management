"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Carpenter_Timekeeping_Log extends Model {
    static associate(models) {
      Carpenter_Timekeeping_Log.belongsTo(models.Carpenter, { foreignKey: "carpenter_id" });
      Carpenter_Timekeeping_Log.belongsTo(models.Timekeeping_Log, {
        foreignKey: "timekeeping_log_id",
      });
    }
  }
  Carpenter_Timekeeping_Log.init(
    {
      work_number: DataTypes.INTEGER,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Carpenter_Timekeeping_Log",
    }
  );
  return Carpenter_Timekeeping_Log;
};
