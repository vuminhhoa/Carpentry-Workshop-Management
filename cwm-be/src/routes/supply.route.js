const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supply.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const permissionMiddleware = require("../midlewares/permission.middleware");
const roleMiddleware = require("../midlewares/role.middleware");

router.post("/create", authMiddleware, supplyController.create);
router.patch("/update", authMiddleware, supplyController.update);
router.get("/detail", authMiddleware, supplyController.detail);
router.delete("/delete", authMiddleware, supplyController.delete);
router.get("/search", authMiddleware, supplyController.search);

module.exports = router;
