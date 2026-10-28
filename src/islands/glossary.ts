// glossary behaviour (spec §4.2, §6): filter, ?q= prefill, and a pulse on the entry named by the hash
const fold = (s: string) => s.normalize("NFD").replace(/[\p{M}\u02BE\u02BF\u2018\u2019']/gu, "").toLowerCase();

const input = document.getElementById("q") as HTMLInputElement | null;
const note = document.getElementById("q-note");
const empty = document.getElementById("q-empty");

if (input && note && empty) {
  const entries = [...document.querySelectorAll<HTMLElement>("[data-entry]")].map((el) => ({
    el,
    text: fold([el.id, el.querySelector(".tr")?.textContent, el.querySelector(".en")?.textContent].join(" ")),
  }));
  const groups = [...document.querySelectorAll<HTMLElement>("[data-group]")];
  const slugs = new Set(entries.map((e) => e.el.id));

  function apply() {
    const q = fold(input!.value.trim());
    for (const e of entries) e.el.hidden = !!q && !e.text.includes(q);
    for (const g of groups) g.hidden = !g.querySelector("[data-entry]:not([hidden])");
    empty!.hidden = entries.some((e) => !e.el.hidden);
  }

  input.addEventListener("input", apply);

  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    input.value = q;
    if (!slugs.has(q.toLowerCase())) {
      note.textContent = `No exact match for “${q}”. Showing similar terms.`;
      note.hidden = false;
    }
  }
  apply();

  function land() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el || !el.matches("[data-entry]")) return;
    el.hidden = false;
    el.closest<HTMLElement>("[data-group]")!.hidden = false;
    el.scrollIntoView({ block: "center" });
    el.classList.remove("pulse");
    void el.offsetWidth; // restart the animation on repeat visits
    el.classList.add("pulse");
    el.addEventListener("animationend", () => el.classList.remove("pulse"), { once: true });
  }
  land();
  addEventListener("hashchange", land);
}
