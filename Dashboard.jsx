import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back 👋 Manage your learning here
        </p>
      </div>

      {user ? (
        <>
          {/* USER PROFILE CARD */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md mb-8 flex items-center gap-6">
            
            {/* AVATAR */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white flex items-center justify-center text-2xl font-bold shadow">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* USER INFO */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <h3 className="text-sm text-gray-500">Sessions</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <h3 className="text-sm text-gray-500">Materials</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <h3 className="text-sm text-gray-500">Quizzes</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-sm transition">
                Join Session
              </button>

              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 py-2 rounded-xl transition">
                Upload Material
              </button>

              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 py-2 rounded-xl transition">
                Take Quiz
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-blue-100 rounded-2xl p-8 text-center shadow-md">
          <p className="text-gray-500">
            Please login to view your dashboard
          </p>
        </div>
      )}
    </div>
  );
}