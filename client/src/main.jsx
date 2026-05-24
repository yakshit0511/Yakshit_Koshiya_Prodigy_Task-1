// Entry Point for React Application
// Renders the App inside AuthProvider and mounts to DOM

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/**
 * Render the application
 * Wrap with AuthProvider to make auth context available to all components
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
