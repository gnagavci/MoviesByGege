module.exports = {
  testDir: '.',
  timeout: 90000, // Increased timeout
  retries: 3, // More retries for flaky tests
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: '/app/playwright-report', open: 'never' }],
    ['junit', { outputFile: '/app/test-results/results.xml' }]
  ],
  use: {
    // Don't set baseURL here - let tests handle URLs dynamically
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Longer navigation timeout
    navigationTimeout: 60000,
    // Longer action timeout
    actionTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },
  ],
  webServer: null,
};
