import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    // Other configurations...
    coverage: {
      provider: 'c8', // Use c8 for coverage reporting
      reporter: ['text', 'html'], // Generate both text and HTML reports
      reportsDirectory: './coverage', // Specify the output directory for reports
    },

    globals: true,
    environment: "jsdom",
  },
})
