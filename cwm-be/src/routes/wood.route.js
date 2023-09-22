const express = require("express");
const router = express.Router();
const woodController = require("../controllers/wood.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, woodController.create);
router.get("/list", authMiddleware, woodController.list);
router.get("/detail", authMiddleware, woodController.detail);
router.delete("/delete", authMiddleware, woodController.delete);
router.patch("/update", authMiddleware, woodController.update);

module.exports = router;
