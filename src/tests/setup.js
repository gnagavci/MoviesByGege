import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Use the Docker container URL for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://backend-test:3001/api'
  }
});

global.fetch = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});