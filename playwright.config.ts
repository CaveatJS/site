import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  timeout: 180000,
  expect: { timeout: 45000 },
  use: {
    baseURL: "http://localhost:3100",
    headless: true,
    launchOptions: existsSync(chrome) ? { executablePath: chrome } : undefined,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3100",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      PORT: "3100",
      CAVEAT_TEST_MODE: "1",
      BETTER_AUTH_URL: "http://localhost:3100",
      BETTER_AUTH_SECRET: "caveat-test-auth-secret-0000000000000000000000",
      CAVEAT_SETUP_KEY: "caveat-test-setup-key-0000000000000000000000",
    },
  },
});
