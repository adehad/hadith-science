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

// CSS can't reach SMIL (the Companion's gold shimmer), so reduced motion pauses it here (spec §3.4)
const still = matchMedia("(prefers-reduced-motion: reduce)");
function applyMotion() {
  document.querySelectorAll("svg").forEach((s) => (still.matches ? s.pauseAnimations() : s.unpauseAnimations()));
}
still.addEventListener("change", applyMotion);
applyMotion();
