const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../midlewares/auth.middleware");
const roleMiddleware = require("../midlewares/role.middleware");
const upload = require("../utils/multer.util");

router.get(
  "/detail",
  authMiddleware,
  userController.detail
);
router.get("/profile", authMiddleware, userController.getProfile);
router.post(
  "/create",
  authMiddleware,
  userController.create
);
router.put(
  "/update",
  authMiddleware,
  userController.update
);
router.delete(
  "/delete",
  authMiddleware,
  userController.delete
);
router.get(
  "/search",
  authMiddleware,
  userController.search
);
router.post("/upload_excel", userController.uploadExcel);
router.patch("/update_profile", authMiddleware, userController.updateProfile);

module.exports = router;
