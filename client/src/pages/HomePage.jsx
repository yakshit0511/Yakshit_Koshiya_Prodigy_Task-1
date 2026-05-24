// Home Page - Public Landing Page
// Shows welcome message and navigation buttons

import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/HomePage.css";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">🔐 Welcome to SecureAuth</h1>
            <p className="hero-subtitle">
              A secure MERN authentication system with JWT tokens and role-based access control
            </p>

            {/* Feature List */}
            <ul className="features-list">
              <li>✅ Secure user registration and login</li>
              <li>✅ JWT token-based authentication</li>
              <li>✅ Role-based access control (Admin & User)</li>
              <li>✅ Protected routes and admin panel</li>
              <li>✅ Modern React + MongoDB backend</li>
            </ul>

            {/* Call to Action Buttons */}
            <div className="hero-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Get Started
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hero-illustration">
            <div className="illustration-box">
              <div style={{ fontSize: "100px", textAlign: "center" }}>
                🛡️
              </div>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                Enterprise Security
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="card">
            <div className="card-icon">🚀</div>
            <h3>Fast & Reliable</h3>
            <p>Built with Express.js and MongoDB for optimal performance</p>
          </div>

          <div className="card">
            <div className="card-icon">🔒</div>
            <h3>Secure</h3>
            <p>Password hashing with bcryptjs and JWT token authentication</p>
          </div>

          <div className="card">
            <div className="card-icon">👥</div>
            <h3>Role-Based</h3>
            <p>Admin and user roles with permission-based access control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
