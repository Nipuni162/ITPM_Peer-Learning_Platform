const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 30,
      max: 180,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
       enum: ["requested", "confirmed", "completed", "cancelled", "rescheduled"],
      default: "requested",
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: "" },
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);