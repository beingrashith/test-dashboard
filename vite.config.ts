import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
 plugins: [
    react(),
    tailwindcss()
  ],base: "./",
  server: {
    proxy: {
      "/api": {
        target: "https://admin-moderator-backend-staging.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})