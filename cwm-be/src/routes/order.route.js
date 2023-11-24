const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, orderController.create);
router.get("/search", authMiddleware, orderController.search);
router.get("/detail", authMiddleware, orderController.detail);
router.delete("/delete", authMiddleware, orderController.delete);
router.patch("/update", authMiddleware, orderController.update);

module.exports = router;
