const express = require("express");
const router = express.Router();
const carpenterController = require("../controllers/carpenter.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, carpenterController.create);
router.get("/detail", authMiddleware, carpenterController.detail);
router.delete("/delete", authMiddleware, carpenterController.delete);
router.patch("/update", authMiddleware, carpenterController.update);
router.get("/search", authMiddleware, carpenterController.search);

module.exports = router;
