// the narrator-figure language (spec §3.2): one figure per kind, shared by Chain.astro and the Legend
// so the key always matches the diagram
import type { ComponentProps } from "astro/types";
import type Narrator from "./Narrator.astro";

export type Kind = "sahabi" | "tabii" | "later" | "majhul" | "mubham" | "weak" | "mudallis" | "liar" | "accused" | "ghost";
export type Fig = Omit<ComponentProps<typeof Narrator>, "x" | "y">;

export const FIG: Record<Kind, Fig> = {
  sahabi: { kind: "sahabi" },
  tabii: { kind: "tabii" },
  later: { kind: "later" },
  majhul: { kind: "later", scroll: "yes", seal: "slot" },
  mubham: { kind: "later", face: "blank", scroll: "slot", seal: "slot" },
  // named, so he keeps his scroll; the seal that vouches for him is cracked (spec §3.2)
  weak: { kind: "later", scroll: "yes", seal: "crack" },
  // the /narrators/ concealer: scroll and seal, with a hand over his mouth (phase 3 al-Mardūd design §1)
  mudallis: { kind: "later", face: "hand", scroll: "yes", seal: "yes" },
  // the /narrators/ liar: a mask, his scroll, and a voided seal (phase 3 al-Mardūd design §1)
  liar: { kind: "later", face: "mask", scroll: "yes", seal: "void" },
  // the suspect: the mask only outlined, dashed, and a cracked seal, so suspected, not proven (design §1)
  accused: { kind: "later", face: "mask-dashed", scroll: "yes", seal: "crack" },
  ghost: { ghost: true },
};

// named narrators are drawn reliable, with scroll and seal, unless the book says otherwise (spec §3.2, phase 3
// design §1)
export const RELIABLE = { scroll: "yes", seal: "yes" } as const satisfies Fig;

// kind names shown in Labels mode
export const KIND_NAME: Record<Kind, string> = { sahabi: "Companion", tabii: "Successor", later: "Narrator", majhul: "Unknown", mubham: "Unnamed", weak: "Weak", mudallis: "Conceals", liar: "Liar", accused: "Suspected", ghost: "Missing" };
