const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res
        .status(400)
        .json({ message: "Subject and description are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      subject: subject.trim(),
      description: description.trim(),
      status: "open",
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
};