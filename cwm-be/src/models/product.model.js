"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Product, { foreignKey: "order_id" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      size: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      unit_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
