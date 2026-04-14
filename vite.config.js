import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  appType: "spa",
  base: mode === "production" ? "/scheduler-client/" : "/",
}));
