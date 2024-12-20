import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps for debugging
  },
  server: {
    strictPort: true, // Ensure the server respects the configured port
    open: true,       // Automatically open the app in the browser
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Add aliases for cleaner imports
    },
  },
})
