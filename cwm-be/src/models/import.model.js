"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Import extends Model {
    static associate(models) {
      Import.hasMany(models.Supply_Import, {
        foreignKey: "import_id",
      });
      Import.belongsTo(models.Warehouse, {
        foreignKey: "import_id",
      });
    }
  }
  Import.init(
    {
      code: DataTypes.STRING,
      number: DataTypes.STRING,
      status: DataTypes.INTEGER,
      deliver: DataTypes.STRING,
      create_date: DataTypes.DATE,
      approve_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Import",
    }
  );
  return Import;
};
