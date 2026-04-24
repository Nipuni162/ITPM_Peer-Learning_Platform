import { Link } from "react-router-dom";

export default function TutorCard({ tutor }) {
  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 h-full flex flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          {/* AVATAR */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {tutor.user?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>

          {/* NAME + EMAIL */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {tutor.user?.name || "Tutor Name"}
            </h3>
            <p className="text-sm text-gray-500 break-all">
              {tutor.user?.email || "No email available"}
            </p>
          </div>

          {/* RATING */}
          <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 whitespace-nowrap">
            ⭐ {tutor.averageRating || 0}
          </div>
        </div>

        {/* SUBJECTS */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Modules
          </p>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects?.length > 0 ? (
              tutor.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                >
                  {subject}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">No modules listed</span>
            )}
          </div>
        </div>

        {/* BIO */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Bio
          </p>
          <p className="text-sm text-gray-600 leading-6">
            {tutor.bio || "No bio available"}
          </p>
        </div>

        {/* QUALIFICATIONS */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Qualifications
          </p>
          <p className="text-sm text-gray-600 leading-6">
            {tutor.qualifications || "N/A"}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Reviews</p>
            <p className="text-base font-semibold text-gray-900">
              {tutor.totalReviews || 0}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-base font-semibold text-gray-900">
              {tutor.sessionsCompleted || 0}
            </p>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <Link
        to={`/book/${tutor._id}`}
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-sm transition duration-300"
      >
        Book Session
      </Link>
    </div>
  );
}