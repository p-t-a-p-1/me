import "server-only";
import { createClient } from "newt-client-js";
import type { Article } from "@/types/articles";
import { cache } from "react";

const client = createClient({
  spaceUid: `${process.env.NEWT_SPACE_UID}`,
  token: `${process.env.NEWT_CDN_API_TOKEN}`,
  apiType: "cdn",
});

export const getArticles = cache(async () => {
  const { items } = await client.getContents<Article>({
    appUid: "meBlog",
    modelUid: "article",
    query: {
      select: [
        "_id",
        "title",
        "slug",
        "body",
        "url",
        "pDate",
        "emoji",
        "categories",
      ],
    },
  });
  return items;
});

export const getArticleBySlug = cache(async (slug: string) => {
  const article = await client.getFirstContent<Article>({
    appUid: "meBlog",
    modelUid: "article",
    query: {
      slug,
      select: [
        "_id",
        "title",
        "slug",
        "body",
        "url",
        "pDate",
        "emoji",
        "categories",
      ],
    },
  });
  return article;
});
