// Admin Route Component
// Protects routes that require admin role
// If user is not admin, redirects to dashboard with error message

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        color: "#4f46e5",
      }}>
        <div>
          <div style={{ marginBottom: "20px" }}>Loading...</div>
          <div style={{ fontSize: "40px" }}>⏳</div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to dashboard
  if (!isAdmin) {
    toast.error("Access Denied: Admin privileges required");
    return <Navigate to="/dashboard" replace />;
  }

  // If admin, render the admin page
  return <Outlet />;
};

export default AdminRoute;
