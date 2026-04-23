const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    subjects: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    qualifications: {
      type: String,
      default: "",
      trim: true,
    },

    availability: [
      {
        day: {
          type: String,
          trim: true,
        },
        startTime: {
          type: String,
          trim: true,
        },
        endTime: {
          type: String,
          trim: true,
        },
      },
    ],

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutor", tutorSchema);