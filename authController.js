const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Tutor = require("../models/Tutor");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      subjects,
      bio,
      qualifications,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const finalRole = role || "student";

    if (finalRole === "student") {
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }

      const studentIdRegex = /^IT\d{8}$/;
      if (!studentIdRegex.test(studentId)) {
        return res.status(400).json({
          message: "Invalid Student ID format (e.g., IT21232112)",
        });
      }

      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      studentId: finalRole === "student" ? studentId : undefined,
    });

    if (user.role === "tutor") {
      await Tutor.create({
        user: user._id,
        subjects: subjects || [],
        bio: bio || "",
        qualifications: qualifications || "",
        approved: false,
      });
    }

    res.status(201).json({
      message:
        user.role === "tutor"
          ? "Tutor registered successfully. Waiting for admin approval."
          : "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isActive && user.role !== "admin") {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role === "tutor") {
      const tutorProfile = await Tutor.findOne({ user: user._id });

      if (!tutorProfile) {
        return res.status(403).json({ message: "Tutor profile not found" });
      }

      if (!tutorProfile.approved) {
        return res
          .status(403)
          .json({ message: "Tutor account is pending admin approval" });
      }
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let tutorProfile = null;

    if (req.user.role === "tutor") {
      tutorProfile = await Tutor.findOne({ user: req.user._id });
    }

    res.json({
      user: req.user,
      tutorProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};