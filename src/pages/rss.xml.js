import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SELF } from "../consts.ts";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: SELF.name,
    description: `${SELF.name.split(" ")[0]}'s chaotic posts.`,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}`,
    })),
    stylesheet: "/styles.xsl",
  });
}
