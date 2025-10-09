import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,  // This is shorthand for '0.0.0.0'
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: ['frontend', 'localhost'],  // Allow Docker service name and localhost
    hmr: {
      host: 'localhost'
    }
  }
});
