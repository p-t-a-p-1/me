import { defineCollection, z } from "astro:content";

/**
 * Astroコンテンツコレクション設定
 * 最適化されたブログ記事のスキーマ定義
 */

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // slugはAstroが自動生成するためオプション
    description: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    emoji: z.string().optional(),
    thumbnail: z.string().url().optional(),
    url: z.string().url().optional(),

    // 最適化で追加されたメタデータ
    category: z.string(),
    readingTime: z.number(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    wordCount: z.number(),
    lastOptimized: z.string().optional(),

    // SEO関連
    author: z.string().optional(),
    keywords: z.array(z.string()).default([]),

    // 検索機能用
    searchable: z.boolean().default(true),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
