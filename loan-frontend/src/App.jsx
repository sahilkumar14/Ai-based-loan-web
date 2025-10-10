
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";

function App() {
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem('role') || null; } catch { return null; }
  });
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem('user') || null; } catch { return null; }
  });

  // debug: log role changes when developing
  console.debug('[App] role state:', role, 'user:', user);

  return (
    <Router>
  <Navbar user={user} setUser={setUser} role={role} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Login setRole={setRole} setUser={setUser} />} />
  <Route path="/signup" element={<Signup setUser={setUser} setRole={setRole} />} />
        <Route
          path="/student"
          element={role === "student" ? <StudentDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/distributor"
          element={role === "distributor" ? <DistributorDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;


