import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/watch-shop/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    proxy: {
      '/watch-shop/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/watch-shop/assets': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
})
