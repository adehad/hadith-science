import { test, expect } from "@playwright/test";

// installable app and offline reading (spec §8a)
test("manifest is valid and every icon loads", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBe(true);
  const m = await res.json();
  expect(m.name).toBeTruthy();
  expect(m.start_url).toBe("./");
  expect(m.scope).toBe("./");
  expect(m.display).toBe("standalone");
  const icons: { src: string; sizes: string; purpose?: string }[] = m.icons;
  expect(icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  expect(icons.some((i) => i.purpose === "maskable")).toBe(true);
  for (const i of icons) {
    expect((await request.get(new URL(i.src, res.url()).href)).status(), i.src).toBe(200);
  }
});

test("the head links the manifest and the apple touch icon", async ({ page, request }) => {
  await page.goto("/");
  for (const sel of ['link[rel="manifest"]', 'link[rel="apple-touch-icon"]']) {
    const url = await page.locator(sel).evaluate((l: HTMLLinkElement) => l.href);
    expect((await request.get(url)).status(), sel).toBe(200);
  }
});

test("the service worker registers and serves cached pages offline", async ({ page, context }) => {
  await page.goto("/");
  const script = await page.evaluate(async () => (await navigator.serviceWorker.ready).active?.scriptURL);
  expect(script).toMatch(/\/sw\.js$/);
  // the first load isn't controlled yet; after a reload it is
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toMatch(/\/sw\.js$/);

  await context.setOffline(true);
  try {
    for (const route of ["/terms/", "/al-mardud/"]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).not.toBeEmpty();
    }
    // control: something never cached really is unreachable, so the pages above came from the cache
    await expect(page.goto("/sitemap-index.xml")).rejects.toThrow();
  } finally {
    await context.setOffline(false);
  }
});
