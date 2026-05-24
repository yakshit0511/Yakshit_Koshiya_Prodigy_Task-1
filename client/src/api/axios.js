// Axios Instance Configuration
// Sets up axios with base URL and auth header interceptor

import axios from "axios";
import toast from "react-hot-toast";

/**
 * Create axios instance with base URL
 * In development: uses http://localhost:5000/api (direct backend connection)
 * In production: uses VITE_API_URL env variable or /api (via Vite proxy)
 */
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }
  // Production: use env variable if available, otherwise use /api proxy
  return import.meta.env.VITE_API_URL || "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout for requests
});

/**
 * Request Interceptor
 * Automatically adds JWT token to Authorization header
 * This runs before every API request
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors and shows appropriate user messages
 * Handles specific status codes: 401, 403, 500, etc.
 */
api.interceptors.response.use(
  (response) => {
    // Return response as-is if successful
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message;

    // Handle different error statuses
    switch (status) {
      // 401 Unauthorized - Token expired or invalid
      case 401:
        console.warn("Unauthorized - Clearing session");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error(message || "Session expired. Please log in again.");
        // Redirect to login after a short delay to allow toast to show
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        break;

      // 403 Forbidden - User doesn't have permission
      case 403:
        toast.error(
          message || "You don't have permission to access this resource."
        );
        break;

      // 400 Bad Request - Validation or client error
      case 400:
        toast.error(message || "Invalid request. Please check your input.");
        break;

      // 404 Not Found
      case 404:
        toast.error("Resource not found");
        break;

      // 409 Conflict - Often duplicate email/username
      case 409:
        toast.error(message || "Resource already exists");
        break;

      // 429 Too Many Requests - Rate limit exceeded
      case 429:
        toast.error(
          message || "Too many requests. Please wait a moment and try again."
        );
        break;

      // 500+ Server Error
      case 500:
      case 502:
      case 503:
        console.error("Server Error:", data);
        toast.error(
          message || "Server error. Please try again later."
        );
        break;

      // Network or timeout error
      default:
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (!error.response) {
          console.error("Network Error:", error);
          toast.error(
            "Network error. Please check your internet connection."
          );
        }
    }

    return Promise.reject(error);
  }
);

export default api;
