import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_SWARMUI_URL;

  return {
    server:
      mode === "development" && target
        ? {
            proxy: {
              "/API": { target, changeOrigin: true, ws: true },
              "/View": { target, changeOrigin: true },
              "/Output": { target, changeOrigin: true },
              "/ComfyBackendDirect": { target, changeOrigin: true },
            },
          }
        : undefined,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
})
