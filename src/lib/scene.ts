// what a diagram needs to draw a term trigger: names for the label, and the popover payload
export interface Cap { slug: string; translit: string; ar: string; en: string; section: string; note: string; json: string }

interface CapScene { id: string; captions: { term: string; note: string }[] }
interface CapTerm { id: string; translit: string; ar: string; en: string; section: string }

// keyed by slug; the popover shows this scene's longer note in place of the glossary def
export function captionsFor(scene: CapScene, terms: CapTerm[]): Record<string, Cap> {
  const caps: Record<string, Cap> = {};
  for (const { term, note } of scene.captions) {
    const t = terms.find((x) => x.id === term);
    if (!t) throw new Error(`scene ${scene.id}: caption term ${term} not in inventory`);
    const { translit, ar, en, section } = t;
    caps[term] = { slug: term, translit, ar, en, section, note, json: JSON.stringify({ translit, ar, def: note, section }) };
  }
  return caps;
}

// throws so a typo in a diagram fails the build
export function cap(caps: Record<string, Cap>, slug: string): Cap {
  const c = caps[slug];
  if (!c) throw new Error(`scene caption ${slug} missing`);
  return c;
}
