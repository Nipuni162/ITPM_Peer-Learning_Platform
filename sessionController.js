const Session = require("../models/Session");
const Tutor = require("../models/Tutor");
const User = require("../models/User");
const { createNotification, sendEmail } = require("../services/notificationService");

const bookSession = async (req, res) => {
  try {
    const { tutorId, subject, sessionDate, durationMinutes, notes } = req.body;

    if (!tutorId || !subject || !sessionDate || !durationMinutes) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const tutor = await Tutor.findById(tutorId).populate("user");
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const session = await Session.create({
      student: req.user._id,
      tutor: tutorId,
      subject,
      sessionDate,
      durationMinutes,
      notes,
    });

    await createNotification(
      tutor.user._id,
      "New Session Request",
      `A student requested a session for ${subject}`
    );

    // await sendEmail(
    //   tutor.user.email,
    //   "New Session Request",
    //   `You have a new session request for ${subject}.`
    // );

    res.status(201).json({ message: "Session booked successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySessions = async (req, res) => {
  try {
    let sessions = [];

    if (req.user.role === "student") {
      sessions = await Session.find({ student: req.user._id })
        .populate({
          path: "tutor",
          populate: { path: "user", select: "name email" },
        })
        .sort({ sessionDate: -1 });
    } else if (req.user.role === "tutor") {
      const tutor = await Tutor.findOne({ user: req.user._id });
      if (!tutor) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }

      sessions = await Session.find({ tutor: tutor._id })
        .populate("student", "name email")
        .sort({ sessionDate: -1 });
    }

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id)
      .populate("student", "name email")
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor || String(session.tutor._id) !== String(tutor._id)) {
      return res.status(403).json({ message: "Only the assigned tutor can update this session" });
    }

    session.status = status;
    await session.save();

    if (status === "completed") {
      const tutorDoc = await Tutor.findById(session.tutor._id);
      tutorDoc.sessionsCompleted += 1;
      await tutorDoc.save();
    }

    await createNotification(
      session.student._id,
      "Session Updated",
      `Your session status is now ${status}`
    );

    try {
  await sendEmail(
    session.student.email,
    "Session Updated",
    `Your session status is now ${status}.`
  );
} catch (err) {
  console.log("Email failed:", err.message);
}

    res.json({ message: "Session status updated", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSession = async (req, res) => {
  try {
    const { reason } = req.body;
    const session = await Session.findById(req.params.id)
      .populate("student", "name email")
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const canCancel =
      String(session.student._id) === String(req.user._id) ||
      String(session.tutor.user._id) === String(req.user._id);

    if (!canCancel) {
      return res.status(403).json({ message: "You cannot cancel this session" });
    }

    session.status = "cancelled";
    session.cancellationReason = reason || "";
    await session.save();

    res.json({ message: "Session cancelled successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rescheduleSession = async (req, res) => {
  try {
    const { sessionDate } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (String(session.student) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the student can reschedule the session" });
    }

    session.sessionDate = sessionDate;
    session.status = "rescheduled";
    await session.save();

    res.json({ message: "Session rescheduled successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookSession,
  getMySessions,
  updateSessionStatus,
  cancelSession,
  rescheduleSession,
};