import type { APIRoute } from "astro";
import { loadContent } from "../lib/content";
import { targetPath } from "../lib/terms";

export const GET: APIRoute = async () => {
  const { terms } = await loadContent();
  const index = Object.fromEntries(terms.map((t) => [t.id, targetPath({ slug: t.id, ...t })]));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
};
