const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");

exports.create = async (req, res) => {
  try {
    let data = req?.body;
    let supply;
    const supplyInDB = await db.Supply.findOne({
      where: {
        code: data?.code,
      },
    });
    if (supplyInDB) return errorHandler(res, err.EQUIPMENT_FIELD_DUPLICATED);
    await db.sequelize.transaction(async (t) => {
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "supplies",
        });
        supply = await db.Supply.create(
          { ...data, image: result?.secure_url },
          { transaction: t }
        );
      } else {
        supply = await db.Supply.create(data, { transaction: t });
      }
      await db.Supply_In_Out.create(
        { supply_id: supply.id, quantity: data.quantity },
        { transaction: t }
      );
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.importSuppliesByInboundOrder = async (req, res) => {
  try {
    const data = req.body;
    await db.sequelize.transaction(async (t) => {
      await Promise.all(
        data.map(async (supply) => {
          const isDuplicate = await db.Supply.findOne({
            where: {
              [Op.or]: [{ code: supply?.code }],
            },
            attributes: ["id", "code", "name", "quantity"],
          });
          if (isDuplicate) {
            const newQuantity = supply?.quantity + isDuplicate?.quantity;
            await db.Supply.update(
              { quantity: newQuantity },
              { where: { id: isDuplicate.id } },
              { transaction: t }
            );
            await db.Supply_In_Out.create(
              {
                supply_id: isDuplicate.id,
                quantity: supply?.quantity,
              },
              { transaction: t }
            );
          } else {
            const newSupply = await db.Supply.create(supply, {
              transaction: t,
            });
            await db.Supply_In_Out.create(
              {
                supply_id: newSupply?.id,
                quantity: supply?.quantity,
              },
              { transaction: t }
            );
          }
        })
      );
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.exportSupply = async (req, res) => {};

exports.list = async (req, res) => {
  try {
    let { limit, page, name, risk_level, type_id } = req?.query;

    let filter = { risk_level, type_id };
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { control_number: { [Op.like]: `%${name}%` } },
          // { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      };
    }
    let include = [
      // { model: db.Supply_Type, attributes: ["id", "name"] },
      { model: db.Equipment_Unit, attributes: ["id", "name"] },
      { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
    ];
    console.log(page, limit);
    let supplies = await getList(+limit, page, filter, "Supply", include);
    console.log(supplies);

    return successHandler(res, { supplies, count: supplies.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const supply = await db.Supply.findOne({
      where: { id },
      include: [
        { model: db.Supply_Type, attributes: ["id", "name"] },
        { model: db.Equipment_Unit, attributes: ["id", "name"] },
        { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
      ],
      raw: false,
    });
    return successHandler(res, { supply }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

// exports.delete = async (req, res) => {
//   try {
//     await db.sequelize.transaction(async (t) => {
//       let isHas = await db.Supply.findOne({
//         where: { id: req?.body?.id },
//       });
//       if (!isHas) return errorHandler(res, err.SUPPLY_NOT_FOUND);
//       await db.Supply_In_Out.create(
//         { supply_id: isHas.id, quantity: -isHas.quantity },
//         { transaction: t }
//       );
//       await db.Supply.update(
//         { quantity: 0 },
//         {
//           where: { id: req?.body?.id },
//           transaction: t,
//         }
//       );

//       return successHandler(res, {}, 201);
//     });
//   } catch (error) {
//     return errorHandler(res, error);
//   }
// };

exports.importSupplyForEquipment = async (req, res) => {
  try {
    let data = req?.body;
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id },
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
    await db.sequelize.transaction(async (t) => {
      let supply;
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "supplies",
          // width: 300,
          // crop: "scale"
        });
        supply = await db.Supply.create(
          { ...data, count: 0, image: result?.secure_url },
          { transaction: t }
        );
      } else {
        supply = await db.Supply.create(
          { ...data, count: 0 },
          { transaction: t }
        );
      }
      await db.Equipment_Supply.create(
        {
          equipment_id: data?.equipment_id,
          supply_id: supply.toJSON().id,
          count: data.count,
        },
        { transaction: t }
      );
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.importSuppliesForEquipment = async (req, res) => {
  try {
    let data = req?.body;
    await db.sequelize.transaction(async (t) => {
      await Promise.all(
        data?.supplies?.map(async (item) => {
          let supplyInDB = await db.Supply.findOne({
            where: { id: item.supply_id },
            raw: false,
          });
          if (!supplyInDB) return errorHandler(res, err.SUPPLY_NOT_FOUND);
          let eqHasSupply = await db.Equipment_Supply.findOne({
            where: {
              equipment_id: data?.equipment_id,
              supply_id: item.supply_id,
            },
            raw: false,
          });
          if (eqHasSupply) {
            eqHasSupply.count = eqHasSupply.count + item.count_supply;
            await eqHasSupply.save({ transaction: t });
          } else {
            await db.Equipment_Supply.create(
              {
                equipment_id: data?.equipment_id,
                supply_id: item.supply_id,
                count: item.count_supply,
              },
              { transaction: t }
            );
          }
          supplyInDB.count = supplyInDB.count - item.count_supply;
          await supplyInDB.save({ transaction: t });
        })
      );
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.listEquipmentSupply = async (req, res) => {
  try {
    let {
      page,
      supply_id,
      name,
      risk_level,
      type_id,
      status_id,
      department_id,
      limit = 10,
    } = req?.query;

    let filter = { risk_level, type_id, status_id, department_id };
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { model: { [Op.like]: `%${name}%` } },
          { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      };
    }
    let equipments = await db.Equipment_Supply.findAndCountAll({
      limit: limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      where: { supply_id },
      include: [
        {
          model: db.Equipment,
          where: { ...filter },
          include: [
            { model: db.Equipment_Type, attributes: ["id", "name"] },
            { model: db.Equipment_Unit, attributes: ["id", "name"] },
            { model: db.Equipment_Status, attributes: ["id", "name"] },
            { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
            { model: db.Department, attributes: ["id", "name"] },
          ],
          raw: false,
        },
      ],
      raw: false,
    });
    return successHandler(res, { equipments }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.listSupplyOfEquipment = async (req, res) => {
  try {
    let { page, limit = 10, equipment_id } = req?.query;
    let supplies = await db.Equipment_Supply.findAndCountAll({
      limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      where: { equipment_id },
      include: [
        {
          model: db.Supply,
          include: [
            { model: db.Supply_Type, attributes: ["id", "name"] },
            { model: db.Equipment_Unit, attributes: ["id", "name"] },
            { model: db.Equipment_Risk_Level, attributes: ["id", "name"] },
          ],
        },
      ],
      raw: false,
    });
    return successHandler(res, { supplies }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.importByExcel = async (req, res) => {
  try {
    const data = req.body;
    let duplicateArray = [];
    await db.sequelize.transaction(async (t) => {
      await Promise.all(
        data.map(async (supply) => {
          const isDuplicate = await db.Supply.findOne({
            where: {
              [Op.or]: [{ code: supply?.code }],
            },
          });
          if (isDuplicate) {
            duplicateArray.push(supply);
          } else {
            await db.Supply.create(supply, { transaction: t });
          }
        })
      );
    });
    return successHandler(res, { duplicateArray }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
