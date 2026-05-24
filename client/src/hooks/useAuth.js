// Custom Auth Hook
// Provides easy access to AuthContext throughout the app

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Custom Hook: useAuth
 * Returns auth context value
 * Throws error if used outside AuthProvider
 *
 * Usage:
 * const { user, login, logout } = useAuth();
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure your app is wrapped in <AuthProvider>"
    );
  }

  return context;
};

export default useAuth;
