const Tutor = require("../models/Tutor");

const recommendTutors = async (subject) => {

  const tutors = await Tutor.find({
    subjects: { $in: [subject] }
  })
  .populate("user", "name email")
  .sort({ averageRating: -1, sessionsCompleted: -1 });

  return tutors;
};

module.exports = { recommendTutors };