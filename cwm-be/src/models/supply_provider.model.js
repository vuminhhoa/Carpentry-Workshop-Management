"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Provider extends Model {
    static associate(models) {
      Supply_Provider.belongsTo(models.Supply, { foreignKey: "supply_id" });
      Supply_Provider.belongsTo(models.Provider, { foreignKey: "provider_id" });
    }
  }
  Supply_Provider.init(
    {note: DataTypes.STRING},
    {
      sequelize,
      modelName: "Supply_Provider",
    }
  );
  return Supply_Provider;
};
