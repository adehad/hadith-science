import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// GitHub Pages serves under /hadith-science/; Cloudflare previews and local builds serve at / (spec §8)
const site = process.env.SITE || "http://localhost:4321";
const base = process.env.BASE || "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap({ filter: (p) => !p.includes("/t/") })],
});
