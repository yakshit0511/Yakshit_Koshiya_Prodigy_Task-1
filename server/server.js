// Main Express Server Entry Point
// Initializes and configures the MERN backend application

// Load environment variables from .env file
// Must be done before importing other modules that use process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const { authorize } = require("./middleware/roleMiddleware");

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS Configuration
// Allows frontend to communicate with backend
// In production, update to specific frontend URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse incoming form-encoded request bodies (max 10MB)
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MongoDB Atlas
connectDB();

// ============================================
// API ROUTES
// ============================================

// Health Check Route
// Returns API status - useful for testing server is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Authentication Routes
// All auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/logout
app.use("/api/auth", authRoutes);

// ============================================
// PROTECTED ADMIN ROUTE (Example)
// ============================================

/**
 * Admin Test Route
 * GET /api/admin
 * Requires: Authentication + Admin role
 * Returns: Success message if user is admin
 */
app.get("/api/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
    data: {
      adminId: req.user.id,
      email: req.userData.email,
      role: req.user.role,
    },
  });
});

/**
 * User Test Route
 * GET /api/user
 * Requires: Authentication (any authenticated user)
 * Returns: User's profile information
 */
app.get("/api/user", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome User!",
    data: {
      userId: req.user.id,
      email: req.userData.email,
      name: req.userData.name,
      role: req.user.role,
    },
  });
});

// ============================================
// 404 NOT FOUND HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      health: "GET /api/health",
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      me: "GET /api/auth/me",
      logout: "GET /api/auth/logout",
      admin: "GET /api/admin (requires auth + admin role)",
      user: "GET /api/user (requires auth)",
    },
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   MERN Authentication Backend Server       ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
  console.log(`✓ Server running at: http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log(`✓ Health Check: GET http://localhost:${PORT}/api/health`);
  console.log("");
  console.log("API Endpoints:");
  console.log("  ├─ POST   /api/auth/register");
  console.log("  ├─ POST   /api/auth/login");
  console.log("  ├─ GET    /api/auth/me");
  console.log("  ├─ GET    /api/auth/logout");
  console.log("  ├─ GET    /api/admin (admin only)");
  console.log("  └─ GET    /api/user (authenticated users)");
  console.log("");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle Ctrl+C gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => process.exit(0));
});

module.exports = app;
