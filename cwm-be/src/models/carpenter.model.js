"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Carpenter extends Model {
    static associate(models) {
      Carpenter.belongsTo(models.Carpenter_Status, { foreignKey: "status_id" });
      Carpenter.hasMany(models.Carpenter_Timekeeping_Log, {
        foreignKey: "carpenter_id",
      });
    }
  }
  Carpenter.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING, // số lượng
      image: DataTypes.STRING, // số lượng
      phone: DataTypes.STRING, // nước sản xuất
      gender: DataTypes.STRING, // đơn vị tính nhập chữ
    },
    {
      sequelize,
      modelName: "Carpenter",
    }
  );
  return Carpenter;
};
