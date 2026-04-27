import { useEffect, useState } from "react";
import API from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateSearch = (value) => {
    if (!/^[a-zA-Z0-9\s@._-]*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        search: "Search can contain only letters, numbers, spaces, @ . _ -",
      }));
      return false;
    }

    if (value.length > 50) {
      setErrors((prev) => ({
        ...prev,
        search: "Search cannot exceed 50 characters",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      search: "",
    }));
    return true;
  };

  const fetchData = async () => {
    if (!validateSearch(search)) return;

    try {
      setLoading(true);

      const statsRes = await API.get("/admin/stats");
      const usersRes = await API.get(
        `/admin/users?search=${encodeURIComponent(search)}&role=${encodeURIComponent(roleFilter)}`
      );
      const tutorsRes = await API.get("/admin/tutors");
      const sessionsRes = await API.get("/admin/sessions");
      const complaintsRes = await API.get("/admin/complaints");

      if (!statsRes.data || typeof statsRes.data !== "object") {
        throw new Error("Invalid stats data");
      }

      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);
      setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      alert(error.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (id) => {
    if (!id) {
      alert("Invalid user ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to change this user's status?"
    );
    if (!confirmed) return;

    try {
      await API.put(`/admin/users/${id}/toggle`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const approveTutor = async (id) => {
    if (!id) {
      alert("Invalid tutor ID");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to approve this tutor?");
    if (!confirmed) return;

    try {
      await API.put(`/admin/approve-tutor/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve tutor");
    }
  };

  const rejectTutor = async (id) => {
    if (!id) {
      alert("Invalid tutor ID");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to reject this tutor?");
    if (!confirmed) return;

    try {
      await API.put(`/admin/reject-tutor/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject tutor");
    }
  };

  const resolveComplaint = async (id) => {
    if (!id) {
      alert("Invalid complaint ID");
      return;
    }

    const resolutionNote = prompt("Enter resolution note:");

    if (!resolutionNote || !resolutionNote.trim()) {
      alert("Resolution note is required");
      return;
    }

    if (resolutionNote.trim().length < 5) {
      alert("Resolution note must be at least 5 characters");
      return;
    }

    if (resolutionNote.trim().length > 200) {
      alert("Resolution note cannot exceed 200 characters");
      return;
    }

    try {
      await API.put(`/admin/complaints/${id}/resolve`, {
        resolutionNote: resolutionNote.trim(),
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resolve complaint");
    }
  };

  const exportPDF = () => {
    if (users.length === 0) {
      alert("No users available to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Admin Users Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

    autoTable(doc, {
      startY: 34,
      head: [["Name", "Email", "Role", "Status"]],
      body: users.map((u) => [
        u.name || "N/A",
        u.email || "N/A",
        u.role || "N/A",
        u.isActive ? "Active" : "Inactive",
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    doc.save("users-report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers =
    (stats.totalStudents || 0) +
    (stats.totalTutors || 0) +
    (users.filter((u) => u.role === "admin").length || 0);

  const barData = {
    labels: ["Students", "Tutors", "Sessions", "Completed"],
    datasets: [
      {
        label: "Platform Stats",
        data: [
          stats.totalStudents || 0,
          stats.totalTutors || 0,
          stats.totalSessions || 0,
          stats.completedSessions || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        borderRadius: 6,
      },
    ],
  };

  const roleCounts = {
    admin: users.filter((u) => u.role === "admin").length,
    tutor: users.filter((u) => u.role === "tutor").length,
    student: users.filter((u) => u.role === "student").length,
  };

  const pieData = {
    labels: ["Admins", "Tutors", "Students"],
    datasets: [
      {
        data: [roleCounts.admin, roleCounts.tutor, roleCounts.student],
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading && (
        <div className="mb-4 bg-blue-900/30 border border-blue-700 text-blue-300 px-4 py-3 rounded-xl">
          Loading admin data...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-cyan-400">{totalUsers}</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Students</p>
          <p className="text-2xl font-bold text-blue-400">
            {stats.totalStudents || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Tutors</p>
          <p className="text-2xl font-bold text-green-400">
            {stats.totalTutors || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Sessions</p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats.totalSessions || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-purple-400">
            {stats.completedSessions || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
          <h3 className="mb-4 font-semibold">Platform Stats</h3>
          <Bar data={barData} />
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
          <h3 className="mb-4 font-semibold">User Roles</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {/* User Management */}
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      <div className="flex flex-wrap gap-3 mb-2">
        <div className="flex flex-col">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              validateSearch(value);
            }}
            className={`bg-gray-800 border ${
              errors.search ? "border-red-500" : "border-gray-700"
            } px-3 py-2 rounded-lg text-sm`}
          />
          {errors.search && (
            <p className="text-red-400 text-xs mt-1">{errors.search}</p>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Filter
        </button>

        <button
          onClick={exportPDF}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800 mt-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="border-t border-gray-800 text-center">
                  <td className="p-3">{u.name || "N/A"}</td>
                  <td className="p-3">{u.email || "N/A"}</td>
                  <td className="p-3 capitalize">{u.role || "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleUser(u._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-black"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tutor Approval */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Tutor Approval</h2>

      {tutors.length === 0 ? (
        <p className="text-gray-400">No pending tutor approvals</p>
      ) : (
        <div className="space-y-3">
          {tutors.map((t) => (
            <div
              key={t._id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800"
            >
              <p className="font-medium">
                {t.user?.name || "Unknown"} ({t.user?.email || "No email"})
              </p>

              <p className="text-sm text-gray-400">
                Status: {t.approved ? "Approved" : "Pending"}
              </p>

              {!t.approved && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approveTutor(t._id)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectTutor(t._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sessions */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Sessions</h2>
      <div className="space-y-3">
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <div
              key={s._id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800"
            >
              <p>
                {s.subject || "N/A"} - {s.status || "N/A"}
              </p>
              <p>Student: {s.student?.name || "N/A"}</p>
              <p>Tutor: {s.tutor?.user?.name || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No sessions found</p>
        )}
      </div>

      {/* Complaints */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Complaints</h2>
      <div className="space-y-3">
        {complaints.length > 0 ? (
          complaints.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800"
            >
              <div className="mb-3">
                <p className="text-sm text-gray-400">Submitted By</p>
                <p className="font-semibold text-white">
                  {c.user?.name || "Unknown"} ({c.user?.role || "N/A"})
                </p>
                <p className="text-xs text-gray-500">
                  {c.user?.email || "No email"}
                </p>
              </div>

              <p className="font-medium text-lg">
                {c.subject || "No Subject"}
              </p>

              <p className="text-gray-300 mt-1">
                {c.description || "No description"}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span
                  className={
                    c.status === "resolved"
                      ? "text-green-400 font-semibold"
                      : "text-yellow-400 font-semibold"
                  }
                >
                  {c.status || "N/A"}
                </span>
              </p>

              {c.resolutionNote && (
                <div className="mt-3 bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <p className="text-sm text-blue-300 font-semibold">
                    Resolution Note
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {c.resolutionNote}
                  </p>
                </div>
              )}

              {c.status === "open" && (
                <button
                  onClick={() => resolveComplaint(c._id)}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded mt-3"
                >
                  Resolve
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No complaints found</p>
        )}
      </div>
    </div>
  );
}