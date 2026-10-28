import { defineCollection, reference } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const divisions = defineCollection({
  loader: file("src/content/divisions.yaml"),
  schema: z.object({
    id: slug,
    order: z.number().int().min(1).max(8),
    term: z.string(),
    ar: z.string(),
    en: z.string(),
    sections: z.string(),
    moons: z.array(z.string()).min(1),
  }),
});

const terms = defineCollection({
  loader: file("src/content/terms.yaml"),
  schema: z.object({
    id: slug,
    translit: z.string(),
    ar: z.string(),
    en: z.string(),
    def: z.string().max(200),
    section: z.string().regex(/^§\d+\.\d+/),
    division: reference("divisions"),
    // absent = pending (division not yet built, spec §9)
    scene: z.string().optional(),
    view: z.string().optional(),
  }),
});

export const collections = { divisions, terms };
