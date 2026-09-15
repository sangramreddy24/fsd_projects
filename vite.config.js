import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow `@/` imports to resolve to the client/ folder (e.g. @/components/Navbar)
      '@': path.resolve(import.meta.dirname, 'client'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
