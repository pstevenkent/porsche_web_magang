import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Konfigurasi CSS dihapus dari sini karena kita menggunakan postcss.config.js
})