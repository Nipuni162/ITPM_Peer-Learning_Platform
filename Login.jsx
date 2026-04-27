import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}