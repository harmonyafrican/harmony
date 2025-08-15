import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration
export default defineConfig({
  plugins: [react()],
  
  // Dev server configuration
  server: {
    port: 3000,
    host: true
  },

  // Production build configuration
  build: {
    outDir: 'dist',     // Firebase Hosting expects a 'dist' folder
    sourcemap: true,    // Generates source maps for easier debugging in production
  },

  // Base path configuration
  base: './',           // Ensures asset paths work correctly on Firebase Hosting
})
