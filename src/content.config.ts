import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const pattern = "**/*.{md,mdx}";
const base = (name: string) => `./content/${name}`;

const blog = defineCollection({
  loader: glob({ pattern, base: base("blog") }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
