// every coloured text-on-fill pair (src/lib/palette.ts) reaches 4.5:1 (WCAG 1.4.3) in both themes, worked out from
// tokens.css alone: color-mix(in srgb …) is a weighted mean of the gamma-encoded sRGB channels (CSS Color 5)
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PAIRS } from "../../src/lib/palette";

type RGB = number[];
const css = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const block = (selector: string) => {
  const at = css.indexOf(`${selector}{`);
  if (at < 0) throw new Error(`tokens.css has no ${selector} block`);
  const body = css.slice(at + selector.length + 1, css.indexOf("}", at));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map(([, k, v]) => [k, v.trim()]));
};
const light = block(":root");
const dark = block(':root[data-theme="dark"]');
const THEMES = { light, dark: { ...light, ...dark } };

// split on the commas outside brackets
const args = (s: string) => {
  const out = [""];
  let depth = 0;
  for (const ch of s) {
    if (ch === "," && depth === 0) out.push("");
    else { depth += ch === "(" ? 1 : ch === ")" ? -1 : 0; out[out.length - 1] += ch; }
  }
  return out.map((a) => a.trim());
};

function rgb(value: string, vars: Record<string, string>): RGB {
  const v = value.trim();
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  if (ref) {
    if (!(ref[1] in vars)) throw new Error(`no token ${ref[1]}`);
    return rgb(vars[ref[1]], vars);
  }
  const hex = v.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16) / 255);
  const mix = v.match(/^color-mix\(in srgb,(.*)\)$/);
  if (mix) {
    const parts = args(mix[1]).map((a) => a.match(/^(.*?)(?:\s+([\d.]+)%)?$/)!);
    const p1 = parts[0][2] ? +parts[0][2] : parts[1][2] ? 100 - +parts[1][2] : 50;
    const [a, b] = parts.map((p) => rgb(p[1], vars));
    return a.map((x, i) => (x * p1 + b[i] * (100 - p1)) / 100);
  }
  throw new Error(`can't resolve colour ${v}`);
}

const luminance = (c: RGB) => {
  const [r, g, b] = c.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("token contrast", () => {
  // the system preference and the chosen theme each have a dark block; only the chosen one is resolved below
  it("the two dark blocks agree", () => {
    expect(block(':root:not([data-theme="light"])')).toEqual(dark);
  });
  for (const [theme, vars] of Object.entries(THEMES)) {
    it(`every coloured text reaches 4.5:1 on its fill (${theme})`, () => {
      expect(PAIRS.length).toBeGreaterThan(0);
      const low = PAIRS.map(([text, fill, what]) => [what, +ratio(rgb(text, vars), rgb(fill, vars)).toFixed(2)] as const)
        .filter(([, r]) => r < 4.5);
      expect(low).toEqual([]);
    });
  }
});
