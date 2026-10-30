import { defineConfig } from "vitest/config";
// unit runs before a build; dist reads the built site, so it runs after `bun run build` (test:dist)
export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["tests/unit/**/*.test.ts"] } },
      { test: { name: "dist", include: ["tests/dist/**/*.test.ts"] } },
    ],
  },
});
