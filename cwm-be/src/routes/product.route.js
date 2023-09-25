const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, productController.create);
router.get("/list", authMiddleware, productController.list);
router.get("/detail", authMiddleware, productController.detail);
router.delete("/delete", authMiddleware, productController.delete);
router.patch("/update", authMiddleware, productController.update);

module.exports = router;
