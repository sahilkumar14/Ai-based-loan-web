import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ setUser, setRole }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message || "Account created");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Start applying with a new account</p>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">
              Full name
            </label>
          </div>

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

          <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">Create account</button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Sign in</a>
        </p>
      </div>
    </div>
  );
}
