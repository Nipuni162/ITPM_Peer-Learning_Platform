import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      } catch (error) {
        alert("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with the latest alerts, reminders, and activity
          </p>
        </div>

        {/* TOP SUMMARY */}
        <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notification Center
            </h2>
            <p className="text-sm text-gray-500">
              View all your latest system updates in one place
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
            {notifications.length} Notification
            {notifications.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* EMPTY STATE */}
        {notifications.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              🔔
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-gray-500">
              When you receive updates, alerts, or reminders, they will appear here.
            </p>
          </div>
        ) : (
          /* LIST */
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex items-start gap-4"
              >
                {/* ICON */}
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">
                  🔔
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-base font-semibold text-gray-900">
                      {n.title}
                    </p>

                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                      New
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}