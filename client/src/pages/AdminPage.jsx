// Admin Page - Admin-Only Dashboard
// Shows admin-specific information and controls

import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch admin data from backend
   */
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/admin");
        if (response.data.success) {
          setAdminData(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load admin data");
        console.error("Admin data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Page Header */}
        <div className="admin-header">
          <h1>🎛️ Admin Panel</h1>
          <p>Administrative controls and system information</p>
          <div className="admin-badge">✨ ADMIN ACCESS GRANTED ✨</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div>Loading admin data...</div>
          </div>
        )}

        {/* Admin Content */}
        {!loading && (
          <>
            {/* Admin Message from Backend */}
            {adminData && (
              <div className="admin-alert">
                <h3>Backend Response:</h3>
                <p>{adminData.adminId ? "Welcome Admin!" : adminData.message}</p>
                {adminData.email && (
                  <p>
                    <strong>Logged in as:</strong> {adminData.email}
                  </p>
                )}
              </div>
            )}

            {/* Admin Stats Grid */}
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">127</p>
                  <span className="stat-trend">↑ 12 this month</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚙️</div>
                <div className="stat-content">
                  <h3>System Status</h3>
                  <p className="stat-number">Online</p>
                  <span className="stat-trend">✅ All systems operational</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔐</div>
                <div className="stat-content">
                  <h3>Security</h3>
                  <p className="stat-number">Secure</p>
                  <span className="stat-trend">🛡️ All safe</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Database</h3>
                  <p className="stat-number">Connected</p>
                  <span className="stat-trend">📈 Healthy</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="admin-actions">
              <h2>Admin Actions</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">👥</span>
                  <span>Manage Users</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">🔍</span>
                  <span>View Logs</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">⚙️</span>
                  <span>System Settings</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            {/* Admin Info Table */}
            <div className="admin-table-section">
              <h2>Recent Activity</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>User</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2 hours ago</td>
                    <td>User Registration</td>
                    <td>john@example.com</td>
                    <td><span className="status-badge success">Success</span></td>
                  </tr>
                  <tr>
                    <td>4 hours ago</td>
                    <td>User Login</td>
                    <td>admin@example.com</td>
                    <td><span className="status-badge success">Success</span></td>
                  </tr>
                  <tr>
                    <td>6 hours ago</td>
                    <td>System Backup</td>
                    <td>System</td>
                    <td><span className="status-badge success">Completed</span></td>
                  </tr>
                  <tr>
                    <td>1 day ago</td>
                    <td>User Registration</td>
                    <td>jane@example.com</td>
                    <td><span className="status-badge success">Success</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Admin Profile */}
            <div className="admin-profile">
              <h2>Your Admin Profile</h2>
              <div className="profile-card">
                <div className="profile-avatar">👨‍💼</div>
                <div className="profile-details">
                  <h3>{user?.name}</h3>
                  <p>{user?.email}</p>
                  <div className="profile-meta">
                    <span className="badge badge-admin">ADMIN</span>
                    <span className="badge badge-active">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
