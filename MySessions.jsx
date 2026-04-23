import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import { useNavigate } from "react-router-dom";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/my");
      setSessions(res.data);
    } catch (error) {
      alert("Failed to load sessions");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/sessions/${id}/status`, { status });
      alert("Status updated");
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update");
    }
  };

  const cancelSession = async (id) => {
    try {
      await API.put(`/sessions/${id}/cancel`, {
        reason: "Cancelled by student",
      });
      alert("Session cancelled");
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  const rescheduleSession = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DDTHH:MM)");
    if (!newDate) return;

    try {
      const isoDate = new Date(newDate).toISOString();

      await API.put(`/sessions/${id}/reschedule`, {
        sessionDate: isoDate,
      });

      alert("Session rescheduled");
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || "Reschedule failed");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, manage, and track all your tutoring sessions
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Session Overview
            </h2>
            <p className="text-sm text-gray-500">
              You currently have {sessions.length} session
              {sessions.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
            {user?.role ? `${user.role}` : "User"}
          </div>
        </div>

        {/* SESSIONS */}
        <div className="space-y-6">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                {/* TOP */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {session.subject}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled tutoring session
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit ${getStatusStyle(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Subject
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {session.subject}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {session.status}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Date & Time
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(session.sessionDate).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {session.durationMinutes} mins
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3">
                  {(session.status === "confirmed" ||
                    session.status === "completed") && (
                    <button
                      onClick={() => navigate(`/chat/${session._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                    >
                      Open Chat
                    </button>
                  )}

                  {user?.role === "tutor" &&
                    session.status === "requested" && (
                      <button
                        onClick={() => updateStatus(session._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                      >
                        Accept
                      </button>
                    )}

                  {user?.role === "tutor" &&
                    session.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(session._id, "completed")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                      >
                        Complete
                      </button>
                    )}

                  {user?.role === "student" &&
                    session.status === "requested" && (
                      <>
                        <button
                          onClick={() => cancelSession(session._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => rescheduleSession(session._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                        >
                          Reschedule
                        </button>
                      </>
                    )}

                  {user?.role === "student" &&
                    session.status === "confirmed" && (
                      <button
                        onClick={() => rescheduleSession(session._id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                      >
                        Reschedule
                      </button>
                    )}
                </div>

                {/* REVIEW */}
                {user?.role === "student" &&
                  session.status === "completed" && (
                    <div className="mt-6 pt-6 border-t border-blue-100">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Leave a Review
                      </h3>
                      <ReviewForm
                        sessionId={session._id}
                        onSuccess={fetchSessions}
                      />
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                📅
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No sessions found
              </h3>
              <p className="text-sm text-gray-500">
                Your booked or assigned sessions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}