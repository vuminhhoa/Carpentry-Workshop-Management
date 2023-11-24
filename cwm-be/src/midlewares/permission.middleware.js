const { PermissionSystem } = require("../enums");
const err = require("../errors/index");
const db = require("../models");
const { errorHandler } = require("../utils/ResponseHandle");

const permission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      let permissions = await db.Role_Permission.findAll({
        where: { role_id: user?.role_id },
      });
      let is_check =
        permissions?.filter((item) => item.permission_id === permission)
          ?.length > 0
          ? true
          : false;
      if (!is_check) return errorHandler(res, err.NOT_AUTHORIZED);
      req.user = user;
      next();
    } catch (error) {
      return errorHandler(res, error);
    }
  };
};

module.exports = {
  USER_CREATE: permission(PermissionSystem.USER_CREATE),
  USER_READ: permission(PermissionSystem.USER_READ),
  USER_UPDATE: permission(PermissionSystem.USER_UPDATE),
  USER_DELETE: permission(PermissionSystem.USER_DELETE),
  EQUIPMENT_CREATE: permission(PermissionSystem.EQUIPMENT_CREATE),
  EQUIPMENT_READ: permission(PermissionSystem.EQUIPMENT_READ),
  EQUIPMENT_UPDATE: permission(PermissionSystem.EQUIPMENT_UPDATE),
  EQUIPMENT_DELETE: permission(PermissionSystem.EQUIPMENT_DELETE),
};
