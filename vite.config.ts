import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: '/Users/cloud_prg/Documents/project/github/codex-toy--react/src/test/setup.ts',
  },
})
