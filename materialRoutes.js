const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../utils/fileUpload");
const {
  uploadMaterial,
  getAllMaterials,
} = require("../controllers/materialController");

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("tutor", "admin"),
  upload.single("file"),
  uploadMaterial
);

router.get("/", authMiddleware, getAllMaterials);

module.exports = router;