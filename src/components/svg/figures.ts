// the narrator-figure language (spec §3.2): one figure per kind, shared by Chain.astro and the Legend
// so the key always matches the diagram
import type { ComponentProps } from "astro/types";
import type Narrator from "./Narrator.astro";

export type Kind = "sahabi" | "tabii" | "later" | "majhul" | "mubham" | "ghost";
export type Fig = Omit<ComponentProps<typeof Narrator>, "x" | "y">;

export const FIG: Record<Kind, Fig> = {
  sahabi: { kind: "sahabi" },
  tabii: { kind: "tabii" },
  later: { kind: "later" },
  majhul: { kind: "later", scroll: "yes", seal: "slot" },
  mubham: { kind: "later", face: "blank", scroll: "slot", seal: "slot" },
  ghost: { ghost: true },
};

// kind names shown in Labels mode
export const KIND_NAME: Record<Kind, string> = { sahabi: "Companion", tabii: "Successor", later: "Narrator", majhul: "Unknown", mubham: "Unnamed", ghost: "Missing" };
