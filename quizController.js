const Quiz = require("../models/Quiz");

const createQuiz = async (req, res) => {
  try {
    const { title, subject, questions } = req.body;

    if (!title || !subject || !questions || !questions.length) {
      return res
        .status(400)
        .json({ message: "Title, subject and questions are required" });
    }

    const quiz = await Quiz.create({
      title,
      subject,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name email");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((q, index) => {
      const selectedAnswer = answers[index] || "";
      const isCorrect = selectedAnswer === q.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      results.push({
        question: q.question,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    });

    res.json({
      message: "Quiz submitted successfully",
      totalQuestions: quiz.questions.length,
      score,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  submitQuiz,
};