// precache the built site so it installs as a PWA and reads offline (spec §8a)
// usage: bun scripts/sw.mjs [dir]   (runs after astro build; dir defaults to dist)
import { generateSW } from "workbox-build";

const dir = process.argv[2] ?? "dist";
const { count, size, warnings } = await generateSW({
  globDirectory: dir,
  globPatterns: ["**/*.{html,css,js,svg,png,woff2,json,webmanifest}"],
  // /t/ pages are instant redirects; the glossary they point to is precached
  globIgnores: ["t/**", "sitemap*.xml"],
  swDest: `${dir}/sw.js`,
  navigateFallback: null,
  // every query string on this site (?view=, ?t=, a bare ?slug) is read by the browser and the pages are static,
  // so a precached page answers whatever query it carries
  ignoreURLParametersMatching: [/.*/],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  runtimeCaching: [
    {
      // never cache the /t/ redirect pages at runtime either
      urlPattern: ({ request, url }) => request.mode === "navigate" && !/\/t\/[^/]+\/?$/.test(url.pathname),
      handler: "NetworkFirst",
      options: { cacheName: "pages", networkTimeoutSeconds: 3 },
    },
  ],
});
for (const w of warnings) console.warn(w);
console.log(`sw: precached ${count} files, ${(size / 1024).toFixed(0)} KiB`);
