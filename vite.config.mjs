import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2003, // CRA mặc định 3000
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/, // xử lý cả js, jsx, ts, tsx
  },
});
