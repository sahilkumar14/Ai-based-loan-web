import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, role, setRole, setUser }) {
  const navigate = useNavigate();

  const readStored = () => {
    try {
      const sUser = localStorage.getItem('user');
      const sRole = localStorage.getItem('role');
      return { sUser, sRole };
    } catch {
      return { sUser: null, sRole: null };
    }
  };

  const [displayUser, setDisplayUser] = useState(() => user || readStored().sUser || null);
  const [displayRole, setDisplayRole] = useState(() => role || readStored().sRole || null);

  useEffect(() => {
    // when parent props change, reflect them
    if (user) setDisplayUser(user);
    if (role) setDisplayRole(role);
  }, [user, role]);

  useEffect(() => {
    // listen to localStorage changes from other tabs or direct updates
    const onStorage = (e) => {
      if (e.key === 'user' || e.key === 'role' || e.key === null) {
        const { sUser, sRole } = readStored();
        setDisplayUser(sUser || user || null);
        setDisplayRole(sRole || role || null);
      }
    };
    window.addEventListener('storage', onStorage);
    // listen to custom same-tab auth change events
    const onAuthChanged = (e) => {
      const d = e?.detail || {};
      setDisplayUser(d.user || readStored().sUser || user || null);
      setDisplayRole(d.role || readStored().sRole || role || null);
    };
    window.addEventListener('authChanged', onAuthChanged);
    return () => window.removeEventListener('storage', onStorage);
  }, [user, role]);

  const handleLogout = () => {
    if (setRole) setRole(null);
    if (setUser) setUser(null);
    try {
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('devUser');
    } catch {}
    setDisplayUser(null);
    setDisplayRole(null);
    navigate("/");
  };

  useEffect(() => {
    // debug
    console.debug('[Navbar] displayUser, displayRole:', displayUser, displayRole);
  }, [displayUser, displayRole]);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Credify
      </Link>

      <div className="flex items-center gap-4">
        {displayUser ? (
          <>
            <span className="text-gray-700 capitalize">
              {displayUser}
              {displayRole ? ` (${displayRole})` : ""}
            </span>
            <Link
              to={displayRole === "student" ? "/student" : "/distributor"}
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
