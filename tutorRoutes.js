const express = require("express");
const router = express.Router();
const {
  getAllTutors,
  searchTutors,
  getTutorById,
  addTutorReview,
} = require("../controllers/tutorController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllTutors);
router.get("/search", searchTutors);
router.get("/:id", getTutorById);
router.post("/review/:sessionId", authMiddleware, addTutorReview);

module.exports = router;