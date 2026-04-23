import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [quizForm, setQuizForm] = useState({
    title: "",
    subject: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  const fetchQuizzes = async () => {
    try {
      const res = await API.get("/quizzes");
      setQuizzes(res.data);
    } catch (error) {
      alert("Failed to load quizzes");
    }
  };

  const createQuiz = async (e) => {
    e.preventDefault();

    try {
      await API.post("/quizzes/create", {
        title: quizForm.title,
        subject: quizForm.subject,
        questions: [
          {
            question: quizForm.question,
            options: quizForm.options,
            correctAnswer: quizForm.correctAnswer,
          },
        ],
      });

      setQuizForm({
        title: "",
        subject: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });

      fetchQuizzes();
      alert("Quiz created successfully");
    } catch (error) {
      alert("Failed to create quiz");
    }
  };

  const submitQuiz = async (quizId) => {
    try {
      if (!answers[quizId]) {
        alert("Please select an answer first");
        return;
      }

      const res = await API.post(`/quizzes/${quizId}/submit`, {
        answers: [answers[quizId]],
      });

      setQuizResults((prev) => ({
        ...prev,
        [quizId]: res.data,
      }));

      alert("Quiz submitted successfully");
    } catch (error) {
      alert("Failed to submit quiz");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-sm text-gray-500">
            Test your knowledge and track your performance
          </p>
        </div>

        {/* CREATE QUIZ (Tutor) */}
        {user?.role === "tutor" && (
          <form className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm mb-8" onSubmit={createQuiz}>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create Quiz
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Quiz Title"
                value={quizForm.title}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, title: e.target.value })
                }
                className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                placeholder="Subject"
                value={quizForm.subject}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, subject: e.target.value })
                }
                className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <input
              placeholder="Question"
              value={quizForm.question}
              onChange={(e) =>
                setQuizForm({ ...quizForm, question: e.target.value })
              }
              className="w-full mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* OPTIONS */}
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {quizForm.options.map((opt, idx) => (
                <input
                  key={idx}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...quizForm.options];
                    newOptions[idx] = e.target.value;
                    setQuizForm({ ...quizForm, options: newOptions });
                  }}
                  className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>

            <input
              placeholder="Correct Answer"
              value={quizForm.correctAnswer}
              onChange={(e) =>
                setQuizForm({ ...quizForm, correctAnswer: e.target.value })
              }
              className="w-full mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-sm transition">
              Create Quiz
            </button>
          </form>
        )}

        {/* QUIZ LIST */}
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Subject: {quiz.subject}
              </p>

              {quiz.questions.map((q, index) => (
                <div key={index} className="mb-5">
                  <p className="font-medium text-gray-900 mb-3">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((option, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-100 transition"
                      >
                        {user?.role === "student" ? (
                          <>
                            <input
                              type="radio"
                              name={`quiz-${quiz._id}-${index}`}
                              value={option}
                              onChange={(e) =>
                                setAnswers({
                                  ...answers,
                                  [quiz._id]: e.target.value,
                                })
                              }
                              className="accent-blue-600"
                            />
                            <span>{option}</span>
                          </>
                        ) : (
                          <span>{option}</span>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Tutor Answer */}
                  {user?.role === "tutor" && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <p className="text-sm text-green-700">
                        <strong>Correct Answer:</strong> {q.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* SUBMIT */}
              {user?.role === "student" && (
                <>
                  <button
                    onClick={() => submitQuiz(quiz._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                  >
                    Submit Quiz
                  </button>

                  {quizResults[quiz._id] && (
                    <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="font-semibold text-blue-700">
                        Score: {quizResults[quiz._id].score} /{" "}
                        {quizResults[quiz._id].totalQuestions}
                      </p>

                      {quizResults[quiz._id].results?.map((r, idx) => (
                        <div key={idx} className="mt-3 border-t pt-3">
                          <p><strong>Q:</strong> {r.question}</p>
                          <p><strong>Your:</strong> {r.selectedAnswer}</p>
                          <p><strong>Correct:</strong> {r.correctAnswer}</p>
                          <p
                            className={
                              r.isCorrect
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {r.isCorrect ? "Correct" : "Incorrect"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}