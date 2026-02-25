import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Homestays from "./pages/Homestays.jsx";
import Attractions from "./pages/Attractions.jsx";
import Reviews from "./pages/Reviews.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import GuideDashboard from "./pages/GuideDashboard.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Payment from "./pages/Payment.jsx";
import NotFound from "./pages/NotFound.jsx";
import StatePage from "./pages/StatePage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= TOURIST FLOW ================= */}

          {/* Tourist Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* State Page */}
          <Route
            path="/state/:stateName"
            element={
              <ProtectedRoute>
                <StatePage />
              </ProtectedRoute>
            }
          />

          {/* Homestays */}
          <Route
            path="/homestays"
            element={
              <ProtectedRoute>
                <Homestays />
              </ProtectedRoute>
            }
          />

          {/* Attractions */}
          <Route
            path="/attractions"
            element={
              <ProtectedRoute>
                <Attractions />
              </ProtectedRoute>
            }
          />

          {/* Reviews */}
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />

          {/* Payment */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* ================= ROLE-BASED DASHBOARDS ================= */}

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/guide"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/host"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
    </div>
  );
}