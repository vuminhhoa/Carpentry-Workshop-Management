const express = require("express");
const router = express.Router();
const timekeepingLogController = require("../controllers/timekeeping_log.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, timekeepingLogController.create);
router.get("/search", authMiddleware, timekeepingLogController.search);
router.get("/detail", authMiddleware, timekeepingLogController.detail);
router.delete("/delete", authMiddleware, timekeepingLogController.delete);
router.patch("/update", authMiddleware, timekeepingLogController.update);

module.exports = router;
