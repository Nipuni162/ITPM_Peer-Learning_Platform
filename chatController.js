const Message = require("../models/Message");
const Session = require("../models/Session");
const Tutor = require("../models/Tutor");

const getMessagesBySession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate("student")
      .populate({
        path: "tutor",
        populate: { path: "user" },
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isStudent = String(session.student._id) === String(req.user._id);
    const isTutor = String(session.tutor.user._id) === String(req.user._id);

    if (!isStudent && !isTutor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ session: req.params.sessionId })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId, text } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ message: "sessionId and text are required" });
    }

    const session = await Session.findById(sessionId).populate({
      path: "tutor",
      populate: { path: "user" },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isStudent = String(session.student) === String(req.user._id);
    const isTutor = String(session.tutor.user._id) === String(req.user._id);

    if (!isStudent && !isTutor) {
      return res.status(403).json({ message: "Only session participants can send messages" });
    }

    const message = await Message.create({
      session: sessionId,
      sender: req.user._id,
      text,
    });

    const populatedMessage = await Message.findById(message._id).populate("sender", "name email role");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessagesBySession,
  sendMessage,
};