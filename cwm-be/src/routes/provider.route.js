const express = require("express");
const router = express.Router();
const providerController = require("../controllers/provider.controller");
const authMiddleware = require("../midlewares/auth.middleware");

router.post("/create", authMiddleware, providerController.create);
router.get("/list", authMiddleware, providerController.list);
router.get("/detail", authMiddleware, providerController.detail);
router.put("/update", authMiddleware, providerController.update);
router.delete("/delete", authMiddleware, providerController.delete);
router.get("/search", authMiddleware, providerController.search);

module.exports = router;
