// Dashboard Page - Protected User Dashboard
// Shows user profile and info

import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>You are logged in as a <strong>{user?.role}</strong></p>
        </div>

        {/* User Info Card */}
        <div className="info-grid">
          <div className="info-card">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className={`badge badge-${user?.role}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Status:</span>
                <span className="badge badge-active">
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="info-card">
            <h2>Account Summary</h2>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-icon">🔐</div>
                <div>
                  <div className="stat-label">Security</div>
                  <div className="stat-value">Protected</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div>
                  <div className="stat-label">Status</div>
                  <div className="stat-value">Verified</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📧</div>
                <div>
                  <div className="stat-label">Email</div>
                  <div className="stat-value">Confirmed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Panel Link (if user is admin) */}
        {user?.role === "admin" && (
          <div className="admin-section">
            <div className="admin-card">
              <h2>🎛️ Admin Access</h2>
              <p>You have admin privileges. Access the admin panel to manage the system.</p>
              <Link to="/admin" className="btn btn-primary">
                Go to Admin Panel
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <div className="info-box">
            <h3>ℹ️ What Can You Do?</h3>
            <ul>
              <li>View your profile information</li>
              <li>Update your account settings</li>
              <li>Access protected resources</li>
              {user?.role === "admin" && (
                <>
                  <li>Manage system users</li>
                  <li>View system statistics</li>
                  <li>Configure admin settings</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
