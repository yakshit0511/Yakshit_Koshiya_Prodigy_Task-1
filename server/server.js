// Main Express Server Entry Point
// Initializes and configures the MERN backend application

// Load environment variables from .env file
// Must be done before importing other modules that use process.env
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const { authorize } = require("./middleware/roleMiddleware");

// Initialize Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet: Set secure HTTP headers
// Protects app from various well-known web vulnerabilities
app.use(helmet());

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS Configuration
// Allows frontend to communicate with backend
// Configured for both development and production
const allowedOrigins = [
  "http://localhost:3000", // Old dev port
  "http://localhost:5173", // Vite dev server
  process.env.CLIENT_URL, // Production frontend URL from env
  process.env.FRONTEND_URL, // Alternative env variable
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 200,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse incoming form-encoded request bodies (max 10MB)
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============================================
// RATE LIMITING
// ============================================

// Rate limiting for authentication routes
// Prevents brute force attacks on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/api/health";
  },
});

// Rate limiting for general API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiter to all /api routes
app.use("/api/", apiLimiter);

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
// Apply stricter rate limiting to auth endpoints
// All auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/logout
app.use("/api/auth", authLimiter, authRoutes);

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

/**
 * Global Error Handler Middleware
 * Catches all errors and returns appropriate JSON response
 * Handles specific error types like validation, auth, database errors
 *
 * Must be defined AFTER all routes and other middleware
 * IMPORTANT: Must have 4 parameters (err, req, res, next) to be recognized as error middleware
 */
app.use((err, req, res, next) => {
  // Log error for debugging
  console.error("Global Error Handler:", {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific MongoDB Cast Error (invalid object ID)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle MongoDB Duplicate Key Error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or malformed token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again";
  }

  // Return error response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
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
