const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  bookSession,
  getMySessions,
  updateSessionStatus,
  cancelSession,
  rescheduleSession,
} = require("../controllers/sessionController");

router.post("/book", authMiddleware, roleMiddleware("student"), bookSession);
router.get("/my", authMiddleware, getMySessions);
router.put("/:id/status", authMiddleware, roleMiddleware("tutor"), updateSessionStatus);
router.put("/:id/cancel", authMiddleware, cancelSession);
router.put("/:id/reschedule", authMiddleware, roleMiddleware("student"), rescheduleSession);

module.exports = router;