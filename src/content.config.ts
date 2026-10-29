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

// scenes.yaml starts empty and gains one entry per scene task (phase 2 plan)
const scenes = defineCollection({
  loader: file("src/content/scenes.yaml"),
  schema: z.object({
    id: slug,
    division: reference("divisions"),
    moons: z.array(z.number().int().min(0)).min(1), // indices into the division's moons this scene covers
    order: z.number().int().min(1), // order within the division
    title: z.string(),
    eyebrow: z.string(),
    lede: z.string(),
    source: z.string(), // "§5.3 Mutawātir, §5.4 Mashhūr"; page adds the book and translator
    diagram: z.enum(["Routes", "Breaks", "Unknown", "Delivery", "Names", "Grades", "Opposition", "Support", "ActedOn", "Report", "Sorting", "Knowledge", "Lone"]),
    width: z.number().positive(), // diagram viewBox width, for panels
    // note: the longer paraphrase for this scene's popover and "Read as text"; terms.yaml def stays the glossary line
    captions: z.array(z.object({ term: slug, note: z.string().max(420) })).min(1),
    // the first view is the default (Ibn Ḥajar's, spec §5)
    views: z.array(z.object({ id: slug, label: z.string(), scholars: z.string(), note: z.string() })).min(2).optional(),
    panels: z.array(z.object({ id: slug, label: z.string(), x0: z.number(), x1: z.number() })).optional(),
    // text-only items for "Read as text" that are not terms, like the names scene's worked example
    extra: z.array(z.object({ title: z.string(), ar: z.string().optional(), section: z.string(), note: z.string().max(900) })).optional(),
  }),
});

export const collections = { divisions, terms, scenes };
