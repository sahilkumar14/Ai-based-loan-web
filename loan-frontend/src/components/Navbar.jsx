import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, role, setRole, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    if (setUser) setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Credify
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 capitalize">
              {user}
              {role ? ` (${role})` : ""}
            </span>
            <Link
              to={role === "student" ? "/student" : "/distributor"}
              className="text-blue-600 hover:underline"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline ">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
