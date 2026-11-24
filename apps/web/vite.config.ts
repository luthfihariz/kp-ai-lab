import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": mode === "mock" ? "http://localhost:4010" : "http://localhost:8080",
    },
  },
}));
