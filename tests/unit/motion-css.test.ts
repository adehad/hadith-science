// audit S6: a finite animation never declares its end frame (to, 100%), so it ends on the element's own style, and
// with animations stopped (reduced motion, or the motion switch off) every element already rests in its end state.
// It must also play forwards: a reverse or alternate run ends on its start frame, not the element's style.
// Loops never end, so they may declare one: which keyframes are loops is read from the animation declarations that
// run them (infinite), never listed by hand.
// Known dodges, which tests/e2e/motion.spec.ts's M5 catches in the browser instead: an animation-iteration-count or
// animation-direction set in a different block from the animation it changes (each block is read alone), and
// animations started from TypeScript (element.animate) or written in an inline style attribute.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = new URL("../../src/", import.meta.url);
const sources = (readdirSync(src, { recursive: true }) as string[])
  .filter((p) => /\.(astro|css)$/.test(p))
  .map((p) => {
    const file = p.replaceAll("\\", "/");
    return { file, text: readFileSync(new URL(file, src), "utf8").replace(/\/\*[\s\S]*?\*\//g, "") };
  });

// split at a separator outside brackets: "a var(--d,0s), b" by "," is ["a var(--d,0s)", "b"]
function split(s: string, sep: RegExp): string[] {
  const out: string[] = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0 && sep.test(ch)) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

// each @keyframes rule's name and its frame selectors, lowercased
function keyframes(text: string): { name: string; frames: string[] }[] {
  const out: { name: string; frames: string[] }[] = [];
  for (const m of text.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    const frames: string[] = [];
    let depth = 1, sel = "";
    for (let i = m.index + m[0].length; depth > 0 && i < text.length; i++) {
      const ch = text[i];
      if (ch === "{") { if (depth === 1) frames.push(...sel.split(",").map((s) => s.trim().toLowerCase())); depth++; sel = ""; }
      else if (ch === "}") { depth--; sel = ""; }
      else if (depth === 1) sel += ch;
    }
    out.push({ name: m[1], frames });
  }
  return out;
}

const isEnd = (f: string) => f === "to" || (f.endsWith("%") && Number(f.slice(0, -1)) === 100);
const BACKWARDS = /^(reverse|alternate|alternate-reverse)$/i;

interface Run { file: string; name: string; infinite: boolean; backwards: boolean }

// every animation each declaration block runs: one per layer of `animation`, or per `animation-name` paired with
// `animation-iteration-count` and `animation-direction` in the same block (lists repeat, as in CSS)
function runs(file: string, text: string, names: Set<string>): Run[] {
  const out: Run[] = [];
  for (const [, block] of text.matchAll(/\{([^{}]*)\}/g)) {
    const decl = new Map<string, string>();
    for (const d of split(block, /;/)) {
      const at = d.indexOf(":");
      if (at > 0) decl.set(d.slice(0, at).trim().toLowerCase(), d.slice(at + 1).replace(/!important/i, "").trim());
    }
    const short = decl.get("animation");
    if (short) {
      for (const layer of split(short, /,/)) {
        const tokens = split(layer, /\s/);
        const name = tokens.find((t) => names.has(t));
        if (!name) { if (!tokens.includes("none")) out.push({ file, name: `?${layer}`, infinite: false, backwards: false }); continue; }
        out.push({ file, name, infinite: tokens.includes("infinite"), backwards: tokens.some((t) => BACKWARDS.test(t)) });
      }
    }
    const list = decl.get("animation-name");
    if (list) {
      const counts = split(decl.get("animation-iteration-count") ?? "1", /,/);
      const dirs = split(decl.get("animation-direction") ?? "normal", /,/);
      split(list, /,/).forEach((name, i) => {
        if (name !== "none") out.push({ file, name, infinite: counts[i % counts.length] === "infinite", backwards: BACKWARDS.test(dirs[i % dirs.length]) });
      });
    }
  }
  return out;
}

describe("motion css", () => {
  const all = sources.flatMap(({ file, text }) => keyframes(text).map((k) => ({ ...k, file })));
  const names = new Set(all.map((k) => k.name));
  const used = sources.flatMap(({ file, text }) => runs(file, text, names));
  const finite = used.filter((r) => !r.infinite);

  it("every animation runs a declared keyframes rule", () => {
    expect(all.length).toBeGreaterThan(0);
    expect(used.filter((r) => r.name.startsWith("?") || !names.has(r.name)).map((r) => `${r.file}: ${r.name}`)).toEqual([]);
  });

  it("no finite animation runs keyframes that declare an end frame", () => {
    const ending = new Set(all.filter((k) => k.frames.some(isEnd)).map((k) => k.name));
    expect(finite.length).toBeGreaterThan(0);
    // the loops this exempts, so a loop run once by mistake shows up here
    expect(used.some((r) => r.infinite && ending.has(r.name))).toBe(true);
    expect(finite.filter((r) => ending.has(r.name)).map((r) => `${r.file}: ${r.name}`)).toEqual([]);
  });

  it("no finite animation plays backwards", () => {
    expect(finite.filter((r) => r.backwards).map((r) => `${r.file}: ${r.name}`)).toEqual([]);
  });
});
