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
      size: DataTypes.DATE,
      quantity: DataTypes.STRING,
      unit: DataTypes.INTEGER,
      unit_price: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
