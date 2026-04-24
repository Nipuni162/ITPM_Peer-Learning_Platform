import { useEffect, useState } from "react";
import API from "../api/axios";
import TutorCard from "../components/TutorCard";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    minRating: "",
    availableDay: "",
  });
  const [errors, setErrors] = useState({});

  const fetchTutors = async () => {
    try {
      const res = await API.get("/tutors");
      setTutors(res.data);
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    }
  };

  const validateFilters = () => {
    const newErrors = {};

    // Subject validation
    if (filters.subject.trim()) {
      if (!/^[a-zA-Z\s]+$/.test(filters.subject.trim())) {
        newErrors.subject = "Subject can contain only letters and spaces";
      } else if (filters.subject.trim().length < 2) {
        newErrors.subject = "Subject must be at least 2 characters";
      }
    }

    // Rating validation
    if (filters.minRating !== "") {
      const rating = Number(filters.minRating);

      if (isNaN(rating)) {
        newErrors.minRating = "Minimum rating must be a number";
      } else if (rating < 1 || rating > 5) {
        newErrors.minRating = "Minimum rating must be between 1 and 5";
      }
    }

    // Available day validation
    if (filters.availableDay.trim()) {
      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      if (!/^[a-zA-Z\s]+$/.test(filters.availableDay.trim())) {
        newErrors.availableDay = "Day can contain only letters and spaces";
      } else if (
        !validDays.includes(filters.availableDay.trim().toLowerCase())
      ) {
        newErrors.availableDay = "Enter a valid day (e.g. Monday)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const searchTutors = async () => {
    if (!validateFilters()) return;

    try {
      const params = new URLSearchParams();

      if (filters.subject.trim()) {
        params.append("subject", filters.subject.trim());
      }

      if (filters.minRating !== "") {
        params.append("minRating", filters.minRating);
      }

      if (filters.availableDay.trim()) {
        params.append("availableDay", filters.availableDay.trim());
      }

      const res = await API.get(`/tutors/search?${params.toString()}`);
      setTutors(res.data);
    } catch (error) {
      console.error("Failed to search tutors:", error);
    }
  };

  const handleReset = () => {
    setFilters({
      subject: "",
      minRating: "",
      availableDay: "",
    });
    setErrors({});
    fetchTutors();
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Tutors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search and connect with the best tutors for your learning needs
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-md mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Filters
              </h2>
              <p className="text-sm text-gray-500">
                Filter tutors by subject, rating, and available day
              </p>
            </div>

            <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
              {tutors.length} Tutor{tutors.length !== 1 ? "s" : ""} Found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* SUBJECT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. ITPM"
                value={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.target.value })
                }
                className={`w-full bg-blue-50 border ${
                  errors.subject ? "border-red-400" : "border-blue-100"
                } rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            {/* RATING */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="1 to 5"
                value={filters.minRating}
                onChange={(e) =>
                  setFilters({ ...filters, minRating: e.target.value })
                }
                className={`w-full bg-blue-50 border ${
                  errors.minRating ? "border-red-400" : "border-blue-100"
                } rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
              />
              {errors.minRating && (
                <p className="text-red-500 text-xs mt-1">{errors.minRating}</p>
              )}
            </div>

            {/* DAY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Day
              </label>
              <input
                type="text"
                placeholder="e.g. Monday"
                value={filters.availableDay}
                onChange={(e) =>
                  setFilters({ ...filters, availableDay: e.target.value })
                }
                className={`w-full bg-blue-50 border ${
                  errors.availableDay ? "border-red-400" : "border-blue-100"
                } rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
              />
              {errors.availableDay && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.availableDay}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col justify-end">
              <label className="block text-sm font-medium text-transparent mb-2">
                Actions
              </label>
              <div className="flex gap-2">
                <button
                  onClick={searchTutors}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-sm transition duration-300"
                >
                  Search
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-medium px-4 py-3 rounded-xl transition duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TUTORS SECTION */}
        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="transition duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl"
              >
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              ?
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tutors found
            </h3>
            <p className="text-sm text-gray-500">
              Try changing your filters and search again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}