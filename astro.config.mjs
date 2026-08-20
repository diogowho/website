// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://diogocastro.net",
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  integrations: [sitemap(), mdx(), icon()],

  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
    "/xenyth": "https://xenyth.net/?affid=3281",
    "/ifog": "https://my.ifog.ch/order/forms/a/MjY3Nw==",
    "/bunny": "https://bunny.net?ref=u6qwwyl0ie",
    "/tally": "https://tally.cello.so/AHpwF04iYO6",
  },
});
