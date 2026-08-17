import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SELF } from "../consts";

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: SELF.name,
    description: "A place for my thoughts in markdown.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      ...(post.data.updatedDate && { updatedDate: post.data.updatedDate }),
      link: `/blog/${post.id}`,
    })),
    customData: "<language>en-gb</language>",
  });
}
