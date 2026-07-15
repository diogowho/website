// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://diogocastro.net",
  output: "static",

  integrations: [sitemap(), mdx(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
