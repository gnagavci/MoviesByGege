#!/usr/bin/env node

// Simple test runner for local development
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Running E2E tests locally...');

// Ensure test-results directory exists
const testResultsDir = './test-results';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// Set environment variables for local testing
process.env.FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

console.log('🌐 Frontend URL:', process.env.FRONTEND_BASE_URL);
console.log('🔧 Backend URL:', process.env.BACKEND_URL);

try {
  // Run Playwright tests with local config
  execSync('npx playwright test --config=playwright.config.js', {
    stdio: 'inherit',
    cwd: __dirname,
    timeout: 300000 // 5 minutes
  });

  console.log('✅ E2E tests completed successfully!');
} catch (error) {
  console.error('❌ E2E tests failed:', error.message);
  console.log('📸 Check test-results/ directory for screenshots and reports');
  process.exit(1);
}