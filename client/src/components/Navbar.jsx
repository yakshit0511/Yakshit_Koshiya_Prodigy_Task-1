// Navigation Bar Component
// Shows different links based on authentication status

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          🔐 SecureAuth
        </Link>

        {/* Navigation Links */}
        <div className="navbar-menu">
          {!isAuthenticated ? (
            // Not logged in - show public links
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-link-register">
                Register
              </Link>
            </>
          ) : (
            // Logged in - show authenticated links
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              {/* Show Admin Panel only for admins */}
              {user?.role === "admin" && (
                <Link to="/admin" className="nav-link nav-link-admin">
                  Admin Panel
                </Link>
              )}

              {/* User Info and Logout */}
              <div className="navbar-user">
                <span className="user-greeting">
                  Welcome, <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="nav-btn logout-btn"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
