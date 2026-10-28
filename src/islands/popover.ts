// term popover (spec §3.5, §6): any [data-term][data-term-json] element is a trigger. One HTML overlay
// serves the page; it opens on click, Enter or Space, sits by the trigger (a bottom sheet on phones),
// and closes on Escape, an outside click or opening another term. Behaviour ported from the mockup's
// showTip/hideTip, made into a dialog that keeps focus.
import { href } from "../lib/url";

interface TermData { translit: string; ar: string; def: string; section: string }

const TRIGGER = "[data-term][data-term-json]";
const pop = document.getElementById("term-pop");

// Triggers are plain markup until script runs, so they are not focusable or announced as buttons without it
document.querySelectorAll(TRIGGER).forEach((el) => {
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-haspopup", "dialog");
  el.setAttribute("aria-expanded", "false");
});

if (pop) {
  const $ = <T extends Element>(sel: string) => pop.querySelector<T>(sel)!;
  const title = $<HTMLElement>(".tp-term"), ar = $<HTMLElement>(".tp-ar");
  const def = $<HTMLElement>(".tp-def"), sec = $<HTMLElement>(".tp-sec");
  const copy = $<HTMLButtonElement>('[data-act="copy"]'), share = $<HTMLButtonElement>('[data-act="share"]');
  const glossary = $<HTMLAnchorElement>('[data-act="glossary"]'), close = $<HTMLButtonElement>(".tp-close");
  const narrow = matchMedia("(max-width: 640px)");
  const canShare = typeof navigator.share === "function";
  let owner: Element | null = null, data: TermData | null = null, copied = 0;

  // built here, not baked into the page, so previews and the live site each share their own origin
  const shareUrl = () => new URL(href(`t/${owner!.getAttribute("data-term")}/`), location.origin).href;

  function place() {
    if (!owner) return;
    pop!.classList.toggle("sheet", narrow.matches);
    if (narrow.matches) return;
    // above the trigger if there is room, otherwise below; always inside the viewport
    const r = owner.getBoundingClientRect(), w = pop!.offsetWidth, h = pop!.offsetHeight;
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), innerWidth - w - 16);
    let top = r.top - h - 10 < 8 ? r.bottom + 10 : r.top - h - 10;
    top = Math.min(Math.max(8, top), innerHeight - h - 8);
    pop!.style.left = `${Math.max(8, left)}px`;
    pop!.style.top = `${top}px`;
  }

  function open(el: Element) {
    let d: TermData;
    try { d = JSON.parse(el.getAttribute("data-term-json")!); } catch { return; }
    if (owner && owner !== el) owner.setAttribute("aria-expanded", "false");
    owner = el; data = d;
    const slug = el.getAttribute("data-term")!;
    title.textContent = d.translit;
    ar.textContent = d.ar;
    def.textContent = d.def;
    sec.textContent = `Nuzhat al-Naẓar ${d.section}`;
    glossary.href = href(`terms/#${slug}`);
    share.hidden = !canShare;
    clearTimeout(copied); copy.textContent = "Copy link";
    el.setAttribute("aria-expanded", "true");
    pop!.hidden = false;
    place();
    pop!.focus({ preventScroll: true });
  }

  function hide(refocus: boolean) {
    if (!owner) return;
    const el = owner;
    owner = null; data = null;
    el.setAttribute("aria-expanded", "false");
    pop!.hidden = true;
    if (refocus && (el instanceof HTMLElement || el instanceof SVGElement)) el.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const el = (e.target as Element).closest?.(TRIGGER);
    if (!el) return;
    e.preventDefault();
    if (owner === el) hide(true); else open(el);
  });
  // SVG triggers are <g role="button">, which have no native key handling
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && owner) { e.preventDefault(); hide(true); return; }
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = (e.target as Element).closest?.(TRIGGER);
    if (!el || el instanceof HTMLButtonElement || el instanceof HTMLAnchorElement) return;
    e.preventDefault();
    if (owner === el) hide(true); else open(el);
  });
  document.addEventListener("pointerdown", (e) => {
    const t = e.target as Element;
    if (owner && !pop.contains(t) && !t.closest?.(TRIGGER)) hide(false);
  });
  close.addEventListener("click", () => hide(true));

  copy.addEventListener("click", () => {
    if (!data || !owner) return;
    navigator.clipboard?.writeText(shareUrl()).then(() => {
      copy.textContent = "Copied";
      clearTimeout(copied);
      copied = window.setTimeout(() => (copy.textContent = "Copy link"), 2000);
    }).catch(() => {});
  });
  share.addEventListener("click", () => {
    if (!data || !owner) return;
    // a cancelled share sheet rejects with AbortError; nothing else to do either way
    navigator.share({ title: `${data.translit} (${data.ar})`, url: shareUrl() }).catch(() => {});
  });

  const follow = () => { if (owner) requestAnimationFrame(place); };
  addEventListener("scroll", follow, { passive: true, capture: true });
  addEventListener("resize", follow);
  narrow.addEventListener("change", follow);

  function openTerm(slug: string) {
    const el = document.querySelector(`[data-term="${CSS.escape(slug)}"][data-term-json]`);
    if (!el) return false;
    open(el);
    return true;
  }
  window.nuzhah = { ...window.nuzhah, openTerm };

  // before the landing scrolls: switch to the view the term lives in if it isn't the active one, then snap a
  // portrait carousel to the panel holding it (spec §6 Landing)
  function beforeLand(el: Element) {
    const v = el.closest<HTMLElement | SVGElement>("[data-view-show]");
    // parts outside the active view carry "off" (set by the build for the default view, then by viewswitch.ts).
    // Untested until the first view-only term exists; targetPath() normally adds ?view= for such a term anyway.
    if (v?.classList.contains("off")) window.nuzhah?.setView?.(v.dataset.viewShow!.trim().split(/\s+/)[0]);
    window.nuzhah?.reveal?.(el);
  }

  // landing on a scene hash: scroll to the term, ring it, open its popover. Glossary articles carry no
  // data-term-json, so /terms/#slug is handled by glossary.ts alone.
  function land() {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (!slug) return;
    const el = document.querySelector(`[data-term="${CSS.escape(slug)}"][data-term-json]`);
    if (!el) return;
    beforeLand(el);
    // inline "nearest": reveal has already placed a carousel horizontally, so don't recentre it
    el.scrollIntoView({ block: "center", inline: "nearest" });
    el.classList.remove("landing");
    el.classList.add("landing");
    el.addEventListener("animationend", () => el.classList.remove("landing"), { once: true });
    openTerm(slug);
  }
  // land() needs setView (viewswitch.ts) and reveal (carousel.ts), which register when their own modules run.
  // Module scripts all run, in document order, before DOMContentLoaded, so waiting for it makes the landing
  // independent of the order the islands are included in (a microtask would still run before later modules).
  if (document.readyState === "complete") land();
  else addEventListener("DOMContentLoaded", land, { once: true });
}
