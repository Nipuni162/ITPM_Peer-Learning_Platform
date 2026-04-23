import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLink = (path) =>
    `relative px-3 py-2 text-sm font-medium transition duration-200 ${
      isActive(path)
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-500"
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center flex-wrap shadow-sm">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link to="/" className={navLink("/")}>
          Dashboard
          {isActive("/") && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-600 rounded"></span>
          )}
        </Link>

        {user && (
          <>
            <Link to="/tutors" className={navLink("/tutors")}>
              Tutors
            </Link>

            <Link to="/sessions" className={navLink("/sessions")}>
              My Sessions
            </Link>

            <Link to="/forum" className={navLink("/forum")}>
              Forum
            </Link>

            <Link to="/materials" className={navLink("/materials")}>
              Materials
            </Link>

            <Link to="/quizzes" className={navLink("/quizzes")}>
              Quizzes
            </Link>

            <Link to="/progress" className={navLink("/progress")}>
              Progress
            </Link>

            <Link to="/complaints" className={navLink("/complaints")}>
              Complaints
            </Link>

            {/* NOTIFICATIONS */}
            <Link
              to="/notifications"
              className="relative text-gray-600 hover:text-blue-500 text-lg ml-2"
            >
              🔔
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                3
              </span>
            </Link>
          </>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`px-3 py-2 text-sm font-semibold ${
              isActive("/admin")
                ? "text-blue-700"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            Admin
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        {user ? (
          <>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}