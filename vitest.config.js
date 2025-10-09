// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    exclude: [
      'node_modules/**',
      'server/**',
      'dist/**',
      'e2e/**'  // Add this line to exclude E2E tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/tests/**',
        'server/**',
        'e2e/**',  // Add this too
        '**/*.config.js'
      ]
    }
  }
});