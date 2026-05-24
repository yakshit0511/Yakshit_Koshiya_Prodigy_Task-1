// Vite Configuration
// Sets up development and production build settings

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite Configuration
 * - Uses React plugin for JSX support
 * - Configures proxy for API calls to backend
 * - Sets up port 5173 for development
 */
export default defineConfig({
  plugins: [react()],

  // Development server settings
  server: {
    port: 5173,
    strictPort: true,
    open: false,

    // Proxy API requests to backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // No need to rewrite path - /api stays as /api
      },
    },
  },

  // Build settings
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1000,
  },

  // Alias for imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
