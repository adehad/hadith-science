// where coloured text sits on a coloured fill (audit D2): [text, fill, what], as CSS colours over the tokens.css
// tokens. tests/unit/contrast.test.ts resolves each in both themes and checks it reaches 4.5:1 (WCAG 1.4.3).
import { stepFill } from "./staircase";

// a criticism rung on "What did the critics call him?" (Ranks.astro): the gap colour, from GAP_MAX% on the worst rung
// down to GAP_MAX - 20% on the mildest; lvl 0 is the mildest, of n rungs
export const GAP_MAX = 26;
export const gapFill = (lvl: number, n: number) => `color-mix(in srgb,var(--gap) ${+(GAP_MAX - 20 + (lvl * 20) / (n - 1)).toFixed(2)}%,var(--surface))`;

export const PAIRS: [text: string, fill: string, what: string][] = [
  ["var(--ok-ink)", "var(--ok-tint)", "accept pill"],
  ["var(--ok-ink)", "var(--support-tint)", "support pill"],
  ["var(--pause-ink)", "var(--pause-tint)", "pause pill"],
  ["var(--gap-ink)", "var(--gap-tint)", "reject pill"],
  ["var(--gold-ink)", "var(--gold-tint)", "gold pill"],
  ["var(--pause-ink)", "var(--view-tint)", "view tag"],
  ["var(--pause-ink)", "var(--pause-wash)", "acted-on's ? on its pause card"],
  ["var(--gold-ink)", "var(--surface)", "gold ink on the page"],
  ["var(--ok-on-moon)", "var(--moon)", "added words on a text card"],
  // the darkest step and rung; the paler ones are further from the text in both themes
  ["var(--on-gold)", stepFill(0), "words on a gold step or rung"],
  // the ranks' rungs carry --fg text; their darkest gold and gap rungs
  ["var(--fg)", stepFill(0), "words on the top praise rung"],
  ["var(--fg)", `color-mix(in srgb,var(--gap) ${GAP_MAX}%,var(--surface))`, "words on the worst criticism rung"],
];
