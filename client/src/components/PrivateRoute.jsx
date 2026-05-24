// Private Route Component
// Protects routes that require authentication
// If user is not logged in, redirects to login page

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

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

  // If authenticated, render the protected page
  return <Outlet />;
};

export default PrivateRoute;
