import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Progress() {
  const [sessions, setSessions] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await API.get("/sessions/my");
        setSessions(sessionRes.data);

        const quizRes = await API.get("/quizzes/attempts/my");
        setQuizAttempts(quizRes.data);
      } catch {
        setQuizAttempts([]);
      }
    };

    fetchData();
  }, []);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.status === "completed"
  ).length;

  const progressPercent =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Learning Progress
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your sessions, quizzes, and overall learning performance
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {totalSessions}
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Completed Sessions</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {completedSessions}
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Quiz Attempts</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {quizAttempts.length}
            </p>
          </div>

        </div>

        {/* PROGRESS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PROGRESS BAR CARD */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Overall Progress
            </h2>

            <div className="w-full bg-blue-100 rounded-full h-6 overflow-hidden">
              <div
                className="h-6 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              >
                {progressPercent}%
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              You have completed{" "}
              <span className="font-semibold text-gray-900">
                {completedSessions}
              </span>{" "}
              out of{" "}
              <span className="font-semibold text-gray-900">
                {totalSessions}
              </span>{" "}
              sessions
            </p>
          </div>

          {/* QUICK INSIGHT CARD */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Insights
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Completion Rate</span>
                <span className="font-semibold text-blue-600">
                  {progressPercent}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total Quiz Attempts</span>
                <span className="font-semibold text-blue-600">
                  {quizAttempts.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Remaining Sessions</span>
                <span className="font-semibold text-red-500">
                  {totalSessions - completedSessions}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* EMPTY STATE */}
        {totalSessions === 0 && (
          <div className="mt-10 bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No progress data yet
            </h3>
            <p className="text-sm text-gray-500">
              Start attending sessions to track your learning progress.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}