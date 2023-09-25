const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipment.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.get("/detail", authMiddleware, equipmentController.detail);
router.post("/create", authMiddleware, equipmentController.create);
router.patch("/update", authMiddleware, equipmentController.update);
router.delete("/delete", authMiddleware, equipmentController.delete);
router.get("/search", authMiddleware, equipmentController.search);
router.get(
  "/status/list",
  authMiddleware,
  equipmentController.listEquipmentStatuses
);

module.exports = router;
