import { MOTION_KEY, currentMotion, onMotionChange, setMotion } from "../lib/motion";

type Theme = "light" | "dark" | "system";
const THEMES: Theme[] = ["light", "dark", "system"];
const root = document.documentElement;

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable: preference lasts this page only */ }
}

const storedTheme = read("nuzhah-theme") as Theme | null;
let theme: Theme = storedTheme && THEMES.includes(storedTheme) ? storedTheme : "system";
const themeBtn = document.querySelector<HTMLButtonElement>("#theme-toggle");

function applyTheme() {
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  if (themeBtn) {
    themeBtn.querySelector("[data-theme-label]")!.textContent = theme;
    themeBtn.setAttribute("aria-label", `Theme: ${theme}. Activate to change.`);
    themeBtn.setAttribute("aria-pressed", String(theme !== "system"));
  }
}
themeBtn?.addEventListener("click", () => {
  theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  write("nuzhah-theme", theme);
  applyTheme();
});
applyTheme();

const modeBtns = document.querySelectorAll<HTMLButtonElement>(".viewtoggle button");
function applyMode(m: "key" | "labels") {
  root.dataset.mode = m;
  modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
}
modeBtns.forEach((b) =>
  b.addEventListener("click", () => {
    const m = b.dataset.mode === "labels" ? "labels" : "key";
    write("nuzhah-mode", m);
    applyMode(m);
  }),
);
applyMode(read("nuzhah-mode") === "labels" ? "labels" : "key");

// the motion switch (spec §3.4). Page.astro's head script has already set data-motion from storage, and
// MotionToggle.astro's CSS shows "on" or "off" from it; here the switch gets its state. With the system asking for
// reduced motion it is aria-disabled rather than disabled, so it stays in the tab order, and a click does nothing.
// CSS can't reach SMIL (the Companion's gold shimmer), so it is paused here whenever motion is stopped.
const motionBtn = document.querySelector<HTMLButtonElement>("#motion-toggle");
function applyMotion() {
  const state = currentMotion();
  document.querySelectorAll("svg").forEach((s) => (state === "on" ? s.unpauseAnimations() : s.pauseAnimations()));
  if (motionBtn) {
    motionBtn.setAttribute("aria-pressed", String(state === "on"));
    if (state === "system") motionBtn.setAttribute("aria-disabled", "true");
    else motionBtn.removeAttribute("aria-disabled");
  }
}
motionBtn?.addEventListener("click", () => {
  const state = currentMotion();
  if (state === "system") return;
  const on = state !== "on";
  write(MOTION_KEY, on ? "on" : "off");
  setMotion(on);
});
// a choice made in another tab applies here too
addEventListener("storage", (e) => {
  if (e.key === MOTION_KEY) setMotion(e.newValue !== "off");
});
onMotionChange(applyMotion);
applyMotion();
