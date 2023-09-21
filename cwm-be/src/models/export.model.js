"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    static associate(models) {
      Export.hasMany(models.Supply_Export, {
        foreignKey: "export_id",
      });
    }
  }
  Export.init(
    {
      code: DataTypes.STRING,
      number: DataTypes.STRING,
      status: DataTypes.INTEGER,
      receiver: DataTypes.STRING,
      create_date: DataTypes.DATE,
      approve_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Export",
    }
  );
  return Export;
};
