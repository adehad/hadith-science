// app icons for the PWA manifest (spec §8a); regenerate with `bunx pwa-assets-generator`
// output lands next to the source image, so the source lives in public/icons/ (a copy of public/favicon.svg)
import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// the night-sky token (--sky, dark theme) that the favicon is drawn on
const sky = "#090c1b";

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    // public/favicon.svg already serves as the favicon, so no .ico
    transparent: { ...minimal2023Preset.transparent, favicons: [] },
    // less padding than the default 0.3: the glow ring still sits well inside the 80% safe circle
    maskable: { sizes: [512], padding: 0.1, resizeOptions: { background: sky } },
    apple: { sizes: [180], padding: 0.1, resizeOptions: { background: sky } },
  },
  images: ["public/icons/icon.svg"],
});
