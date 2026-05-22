// Authentication Controller
// Handles user registration, login, and profile retrieval logic

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 * Generate JWT Token
 * Creates a JWT token for authenticated users
 *
 * @param {String} userId - The MongoDB user ID
 * @returns {String} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

/**
 * User Registration
 * POST /api/auth/register
 * Creates a new user account with email and password
 *
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 *
 * Response: { success, token, user }
 */
const register = async (req, res) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { name, email, password } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please use a different email or log in.",
      });
    }

    // Create new user document
    // Password will be automatically hashed by the User schema pre-save middleware
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password, // Will be hashed before saving
      role: "user", // Default role for new users
    });

    // Save user to MongoDB Atlas
    await user.save();

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    // Return success response with token and user data (without password)
    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * User Login
 * POST /api/auth/login
 * Authenticates user with email and password
 *
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 *
 * Response: { success, token, user }
 */
const login = async (req, res) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { email, password } = req.body;

    // Find user by email and include password field (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    // Compare entered password with stored hashed password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token for the authenticated user
    const token = generateToken(user._id);

    // Return success response with token and user data
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 * Protected route - returns authenticated user's profile
 * Requires valid JWT token in Authorization header
 *
 * Response: { success, user }
 */
const getMe = async (req, res) => {
  try {
    // User data is attached by protect middleware
    if (!req.userData) {
      return res.status(401).json({
        success: false,
        message: "Unable to retrieve user profile",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: {
        id: req.userData._id,
        name: req.userData.name,
        email: req.userData.email,
        role: req.userData.role,
        isActive: req.userData.isActive,
        createdAt: req.userData.createdAt,
        updatedAt: req.userData.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
};

/**
 * User Logout (Client-side)
 * GET /api/auth/logout
 * Note: With JWT, logout is typically handled client-side by removing the token
 * This endpoint can be used to blacklist tokens server-side if needed
 */
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message:
        "Logout successful! Please remove the token from your client.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  generateToken,
};
