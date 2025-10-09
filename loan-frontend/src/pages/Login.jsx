import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/2563.jpg";

export default function Login({ setRole, setUser }) {
  const bgStyle = {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: replace with your backend URL
    try {
      const res = await fetch("https://your-backend.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setRole(form.role);
        navigate(form.role === "student" ? "/student" : "/distributor");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
  <div className="min-h-screen relative py-6">
      {/* background limited to top 60vh so form area remains visible without scrolling */}
  <div className="absolute inset-0 -z-10" style={bgStyle} aria-hidden />
  <div className="absolute inset-0 z-0 bg-black/8" aria-hidden />
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 relative z-10">
  <h1 className="text-2xl font-bold text-gray-900 mb-0">Welcome back</h1>
  <p className="text-sm text-gray-500 mb-4">Sign in to access your dashboard</p>

        
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                if (setUser) setUser('Dev Student');
                if (setRole) setRole('student');
                navigate('/student');
              }}
              className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
            >
              Auto-login Student
            </button>
            <button
              type="button"
              onClick={() => {
                if (setUser) setUser('Dev Distributor');
                if (setRole) setRole('distributor');
                navigate('/distributor');
              }}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded"
            >
              Auto-login Distributor
            </button>
          </div>
        )}

  <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">
              Password
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-2 border border-gray-200 p-3 rounded-md"
            >
              <option value="student">Student</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>

          {form.role === "student" && (
            <div className="relative">
              <input
                name="AadharCardNumber"
                value={form.AadharCardNumber || ""}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">
                Aadhar Card Number
              </label>
            </div>
          )}

          {form.role === "distributor" && (
            <div className="relative">
              <input
                name="bankname"
                value={form.bankname || ""}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">
                Bank Name
              </label>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">Sign in</button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign up</a>
        </p>
        </div>
      </div>
    </div>
  );
}
