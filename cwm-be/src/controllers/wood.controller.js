const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");

exports.create = async (req, res) => {
  try {
    const data = req?.body;
    await db.sequelize.transaction(async (t) => {
      const woodInDb = await db.Wood.findOne({
        where: {
          code: data?.code,
        },
        attributes: ["id", "name"],
      });
      if (woodInDb) return errorHandler(res, err.EQUIPMENT_FIELD_DUPLICATED);
      const calculateAmount = Number(data.quantity) * Number(data.unit_price);
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "equipment",
        });
        await db.Wood.create(
          {
            ...data,
            image: result?.secure_url,
            amount: calculateAmount,
          },
          { transaction: t }
        );
      } else {
        await db.Wood.create(
          { ...data, amount: calculateAmount },
          { transaction: t }
        );
      }

      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req?.query;
    const wood = await db.Wood.findOne({
      where: { id },
      raw: false,
    });
    return successHandler(res, { wood }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.update = async (req, res) => {
  try {
    const data = req?.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Wood.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);

      const newAmount =
        Number(data?.quantity || isHas.quantity) *
        Number(data?.unit_price || isHas.unit_price);
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "equipment",
        });
        await db.Wood.update(
          { ...data, image: result?.secure_url, amount: newAmount },
          { where: { id: data?.id }, transaction: t }
        );
      } else {
        await db.Wood.update(
          { ...data, amount: newAmount },
          {
            where: { id: data?.id },
            transaction: t,
          }
        );
      }
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Wood.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      await db.Wood.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name } = req?.query;

    let filter = {};

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      };
    }
    let include = [];
    let woods = await getList(+limit, page, filter, "Wood", include);
    return successHandler(res, { woods, count: woods.length }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
