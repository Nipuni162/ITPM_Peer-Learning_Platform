const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createQuiz,
  getAllQuizzes,
  submitQuiz,
} = require("../controllers/quizController");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("tutor", "admin"),
  createQuiz
);

router.get("/", authMiddleware, getAllQuizzes);

router.post(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("student"),
  submitQuiz
);

module.exports = router;