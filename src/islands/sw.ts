// register the offline service worker (spec §8a); only production builds emit sw.js
import { href } from "../lib/url";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  addEventListener("load", () => {
    navigator.serviceWorker.register(href("sw.js"), { scope: href("") }).catch(() => {});
  });
}
