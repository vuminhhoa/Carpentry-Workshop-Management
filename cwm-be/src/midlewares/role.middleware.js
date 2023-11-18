const { RoleSystem } = require("../enums");
const err = require("../errors/index");
const db = require("../models");
const { errorHandler } = require("../utils/ResponseHandle");

const role = (role) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (user.role_id !== role) return errorHandler(res, err.NOT_AUTHORIZED);
      req.user = user;
      next();
    } catch (error) {
      return errorHandler(res, error);
    }
  };
};

module.exports = {
  isAdmin: role(RoleSystem.ADMIN),

  isUser: role(RoleSystem.USER),
};
