import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js is lazy-loaded in its own chunk, so a large chunk is expected
    chunkSizeWarningLimit: 1200,
  },
})
