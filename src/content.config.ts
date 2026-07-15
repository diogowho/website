import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const pattern = "**/*.{md,mdx}";
const base = (name: string) => `./content/${name}`;

const pages = defineCollection({
  loader: glob({ pattern, base: base("pages") }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

export const collections = { pages };
