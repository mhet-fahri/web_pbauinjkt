import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['xlsx', 'framer-motion', 'lucide-react'],
          'vendor-ui': ['@supabase/supabase-js', 'i18next', 'react-i18next'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
