import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function BookSession() {
  const { tutorId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    sessionDate: "",
    durationMinutes: 60,
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔍 VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {};

    // SUBJECT
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // DATE
    if (!form.sessionDate) {
      newErrors.sessionDate = "Please select date and time";
    } else {
      const selectedDate = new Date(form.sessionDate);
      const now = new Date();

      if (selectedDate < now) {
        newErrors.sessionDate = "Cannot select a past date/time";
      }
    }

    // DURATION
    if (!form.durationMinutes) {
      newErrors.durationMinutes = "Duration is required";
    } else if (form.durationMinutes < 30) {
      newErrors.durationMinutes = "Minimum duration is 30 minutes";
    } else if (form.durationMinutes > 180) {
      newErrors.durationMinutes = "Maximum duration is 180 minutes";
    }

    // NOTES (optional)
    if (form.notes && form.notes.length > 200) {
      newErrors.notes = "Notes cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await API.post("/sessions/book", {
        tutorId,
        ...form,
      });

      alert("Session booked successfully");
      navigate("/sessions");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-blue-100 rounded-3xl p-8 shadow-sm">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Book a Session
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to schedule your session with the tutor
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full bg-blue-50 border ${
                errors.subject ? "border-red-400" : "border-blue-100"
              } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Date & Time
            </label>
            <input
              name="sessionDate"
              type="datetime-local"
              value={form.sessionDate}
              onChange={handleChange}
              className={`w-full bg-blue-50 border ${
                errors.sessionDate ? "border-red-400" : "border-blue-100"
              } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.sessionDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sessionDate}
              </p>
            )}
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Minutes)
            </label>
            <input
              name="durationMinutes"
              type="number"
              value={form.durationMinutes}
              onChange={handleChange}
              className={`w-full bg-blue-50 border ${
                errors.durationMinutes ? "border-red-400" : "border-blue-100"
              } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.durationMinutes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.durationMinutes}
              </p>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className={`w-full bg-blue-50 border ${
                errors.notes ? "border-red-400" : "border-blue-100"
              } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm transition"
            >
              Confirm Booking
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-3 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}