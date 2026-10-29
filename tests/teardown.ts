import { rmSync } from "node:fs";

// removes the snapshot of dist that playwright.config.ts took for this run (E2E_SNAPSHOT, set only when the config
// took one itself, never for a directory passed in through E2E_DIST)
export default function teardown() {
  const snapshot = process.env.E2E_SNAPSHOT;
  if (snapshot) rmSync(snapshot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
