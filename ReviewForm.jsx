import { useState } from "react";
import API from "../api/axios";

export default function ReviewForm({ sessionId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      return alert("Please select a valid rating (1-5)");
    }

    if (!comment.trim()) {
      return alert("Please write a comment");
    }

    try {
      setLoading(true);

      await API.post(`/tutors/review/${sessionId}`, {
        rating: Number(rating),
        comment: comment.trim(),
      });

      alert("Review submitted successfully");

      setRating(5);
      setComment("");

      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Leave Review
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          Share your feedback about this session
        </p>
      </div>

      {/* STAR RATING */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </p>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition transform hover:scale-110 ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <p className="text-sm text-blue-600 mt-2 font-medium">
          Selected Rating: {rating}/5
        </p>
      </div>

      {/* COMMENT */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={submitReview}
        disabled={loading}
        className={`w-full text-sm font-medium px-5 py-3 rounded-2xl shadow-sm transition ${
          loading
            ? "bg-blue-300 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}