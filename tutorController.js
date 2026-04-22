const Tutor = require("../models/Tutor");
const Session = require("../models/Session");
const { recommendTutors } = require("../services/tutorRecommendationService");

const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find().populate("user", "name email avatar");
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchTutors = async (req, res) => {
  try {
    const { subject, minRating, availableDay } = req.query;

    const query = {};

    if (subject) {
      query.subjects = { $in: [subject] };
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    if (availableDay) {
      query["availability.day"] = availableDay;
    }

    const tutors = await Tutor.find(query)
      .populate("user", "name email avatar")
      .sort({ averageRating: -1, sessionsCompleted: -1 });

    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate("user", "name email avatar");
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTutorReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId).populate("tutor");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (String(session.student) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the student can review this session" });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ message: "Only completed sessions can be reviewed" });
    }

    session.feedback = { rating, comment };
    await session.save();

    const tutor = await Tutor.findById(session.tutor._id);
    const completedSessions = await Session.find({
      tutor: tutor._id,
      "feedback.rating": { $exists: true },
    });

    const total = completedSessions.reduce((sum, s) => sum + (s.feedback.rating || 0), 0);
    tutor.totalReviews = completedSessions.length;
    tutor.averageRating = completedSessions.length ? total / completedSessions.length : 0;
    await tutor.save();

    res.json({ message: "Review submitted successfully", tutor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTutors,
  searchTutors,
  getTutorById,
  addTutorReview,
};