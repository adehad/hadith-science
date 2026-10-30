import { defineConfig, devices } from "@playwright/test";
import { cpSync, existsSync, rmSync } from "node:fs";

// locally the system Edge stands in for Playwright's Chromium; CI installs the bundled Chromium
const channel = process.env.CI ? undefined : "msedge";
// E2E_PORT lets a run avoid a preview server already on 4321 (which reuseExistingServer would pick up)
const port = Number(process.env.E2E_PORT ?? 4321);

// The run serves, and the specs read, a snapshot of dist taken once at the start, so a `bun run build` elsewhere
// in the same checkout can't empty dist under a running suite: astro build deletes and rewrites it, and while it
// does the preview server answers 404 for terms-index.json, pages and script chunks, which fails whichever tests
// happen to load then. The main process takes the snapshot and passes its path to the workers in E2E_DIST.
// tests/teardown.ts removes the snapshot when the run ends.
if (!process.env.E2E_DIST) {
  if (!existsSync("dist")) throw new Error("playwright: there is no dist to serve; run `bun run build` first");
  const snapshot = `dist-e2e-${port}`;
  rmSync(snapshot, { recursive: true, force: true });
  cpSync("dist", snapshot, { recursive: true });
  process.env.E2E_DIST = snapshot;
  process.env.E2E_SNAPSHOT = snapshot;
}
const dist = process.env.E2E_DIST;

export default defineConfig({
  globalTeardown: "./tests/teardown.ts",
  forbidOnly: !!process.env.CI,
  // one retry on CI so a slow runner reports a flake instead of failing the deploy
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? "github" : "list",
  webServer: { command: `bun run preview --port ${port} --outDir ${dist}`, port, reuseExistingServer: !process.env.CI },
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: "e2e", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"], channel } },
    // software raster on one thread, redrawing whole tiles, so the same page always rasters to the same pixels
    { name: "screenshots", testDir: "tests/screenshots", use: { ...devices["Desktop Chrome"], channel, launchOptions: { args: ["--disable-gpu", "--num-raster-threads=1", "--disable-partial-raster"] } } },
  ],
});
