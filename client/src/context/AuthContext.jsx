// Authentication Context
// Manages global authentication state and provides auth methods

import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

/**
 * Create Authentication Context
 * This context will be used across the entire app
 */
export const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Wraps the entire app and manages auth state
 */
export const AuthProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState(null); // Current logged-in user
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true); // Loading state during initialization

  /**
   * Initialize Auth on App Load
   * Checks localStorage for token and restores session
   * This runs once when app mounts
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          setToken(storedToken);

          // Verify token by calling GET /auth/me
          const response = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.data.success) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * User Registration
   * Creates new user account and establishes session
   */
  const register = async (name, email, password, role = "user") => {
    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        // Save token to localStorage
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update state
        setToken(newToken);
        setUser(response.data.user);

        toast.success("Account created successfully!");
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * User Login
   * Authenticates user with email/password
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Save token to localStorage
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update state
        setToken(newToken);
        setUser(response.data.user);

        toast.success("Login successful!");
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * User Logout
   * Clears token and user from state and localStorage
   */
  const logout = async () => {
    try {
      // Call logout endpoint (optional, for logging on backend)
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear state and localStorage
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
    }
  };

  /**
   * Context value provided to children
   */
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
