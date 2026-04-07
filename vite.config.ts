import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react'
          if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'vendor-router'
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@tanstack/react-query')) return 'vendor-query'
        },
      },
    },
  },
})
