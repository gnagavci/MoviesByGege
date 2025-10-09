// Local development configuration for Playwright tests
module.exports = {
  testDir: '.',
  timeout: 90000,
  retries: 2,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/e2e', open: 'never' }],
    ['junit', { outputFile: 'test-results/e2e/results.xml' }]
  ],
  use: {
    // Local URLs for development testing
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 60000,
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