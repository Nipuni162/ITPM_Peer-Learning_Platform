const User = require("../models/User");
const Tutor = require("../models/Tutor");
const Session = require("../models/Session");
const Complaint = require("../models/Complaint");

/* ==============================
   📊 DASHBOARD STATS
============================== */
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: "completed" });
    const activeSessions = await Session.countDocuments({ status: "confirmed" });
    const openComplaints = await Complaint.countDocuments({ status: "open" });

    res.json({
      totalStudents,
      totalTutors,
      totalSessions,
      completedSessions,
      activeSessions,
      openComplaints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   👥 USER MANAGEMENT (SEARCH + FILTER)
============================== */
const getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   🔁 ACTIVATE / DEACTIVATE USER
============================== */
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   👨‍🏫 TUTOR APPROVAL
============================== */
const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ approved: false })
      .populate("user", "name email isActive")
      .sort({ createdAt: -1 });

    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate("user", "name email");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    tutor.approved = true;
    await tutor.save();

    res.json({ message: "Tutor approved successfully", tutor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate("user", "name email");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    tutor.approved = false;
    await tutor.save();

    res.json({ message: "Tutor rejected successfully", tutor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   📚 SESSION MONITORING
============================== */
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("student", "name email")
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ⚠️ COMPLAINT MANAGEMENT
============================== */
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = "resolved";
    complaint.resolutionNote = req.body.resolutionNote || "";
    await complaint.save();

    res.json({
      message: "Complaint resolved successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   EXPORT
============================== */
module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllTutors,
  approveTutor,
  rejectTutor,
  getAllSessions,
  getAllComplaints,
  resolveComplaint,
};