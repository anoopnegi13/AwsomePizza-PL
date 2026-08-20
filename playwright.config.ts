import { defineConfig, devices } from '@playwright/test';

/**
 * Browser selection via environment variable.
 *
 * Examples:
 * BROWSER=chromium npx playwright test
 * BROWSER=firefox npx playwright test
 * BROWSER=webkit npx playwright test
 * npx playwright test  // Runs all browsers
 */

const browser = process.env.BROWSER?.trim().toLowerCase();

const browserProjects = {
  chromium: {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  firefox: {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  webkit: {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
};

const supportedBrowsers = Object.keys(browserProjects);

if (browser && !supportedBrowsers.includes(browser)) {
  throw new Error(
    `Unsupported browser "${browser}". Supported values are: ${supportedBrowsers.join(', ')}`
  );
}

const projects = browser
  ? [browserProjects[browser as keyof typeof browserProjects]]
  : Object.values(browserProjects);

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if test.only is committed */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporters */
  reporter: [
    ['html'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  /* Shared settings */
  use: {
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying failed tests */
    trace: 'on-first-retry',
  },

  /* Browser projects */
  projects,

  /* Run local dev server before tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});