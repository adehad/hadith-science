import { defineConfig, devices } from "@playwright/test";

// locally the system Edge stands in for Playwright's Chromium; CI installs the bundled Chromium
const channel = process.env.CI ? undefined : "msedge";
// E2E_PORT lets a run avoid a preview server already on 4321 (which reuseExistingServer would pick up)
const port = Number(process.env.E2E_PORT ?? 4321);

export default defineConfig({
  forbidOnly: !!process.env.CI,
  // one retry on CI so a slow runner reports a flake instead of failing the deploy
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? "github" : "list",
  webServer: { command: `bun run preview --port ${port}`, port, reuseExistingServer: !process.env.CI },
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: "e2e", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"], channel } },
    { name: "screenshots", testDir: "tests/screenshots", use: { ...devices["Desktop Chrome"], channel } },
  ],
});
