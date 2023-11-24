const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");
const qr = require("qrcode");
const { checkRoleFromToken } = require("../utils/auth.util");
const { getRoleEmailConfig } = require("../utils/query.util");
const { sequelize } = require("../models");
const { sendUnuseSupplyEmail } = require("../utils/sendEmail.util");

//Supply Controller

exports.create = async (req, res) => {
  try {
    const data = req?.body;
    await db.sequelize.transaction(async (t) => {
      const supplyInDB = await db.Supply.findOne({
        where: {
          code: data?.code,
        },
        attributes: ["id", "name"],
      });
      if (supplyInDB) return errorHandler(res, err.EQUIPMENT_FIELD_DUPLICATED);
      let supply;
      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "supply",
        });
        supply = await db.Supply.create(
          {
            ...data,
            image: result?.secure_url,
            status_id: 1,
          },
          { transaction: t }
        );
      } else {
        supply = await db.Supply.create(
          { ...data, status_id: 1 },
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
    const supply = await db.Supply.findOne({
      where: { id },
      raw: false,
    });
    return successHandler(res, { supply }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req?.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Supply.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);

      if (data?.image) {
        const result = await cloudinary.uploader.upload(data?.image, {
          folder: "supply",
        });
        await db.Supply.update(
          { ...data, image: result?.secure_url },
          { where: { id: data?.id }, transaction: t }
        );
      } else {
        await db.Supply.update(
          { ...data },
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
      let isHas = await db.Supply.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      await db.Supply.destroy({
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
    let { limit, page, name, status_id } = req?.query;

    let filter = {
      status_id,
    };

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
    let supplies = await getList(+limit, page, filter, "Supply", include);
    return successHandler(res, { supplies, count: supplies.length }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateSupply = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Supply.update(
        { regular_inspection: 12 },
        { where: { status_id: 3 }, transaction: t }
      );
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
