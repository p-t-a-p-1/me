import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

/**
 * 検索API エンドポイント
 * GET /api/search.json?q={query}&category={category}&tag={tag}&difficulty={difficulty}
 */

export const GET: APIRoute = async ({ url }) => {
  try {
    // すべてのブログ記事を取得
    const allPosts = await getCollection("blog");

    // 公開済み記事のみフィルタリング
    const publishedPosts = allPosts.filter(
      (post) =>
        !post.data.draft &&
        post.data.searchable !== false &&
        post.data.publishedAt <= new Date(),
    );

    // クエリパラメータを取得
    const query = url.searchParams.get("q")?.toLowerCase().trim() || "";
    const category =
      url.searchParams.get("category")?.toLowerCase().trim() || "";
    const tag = url.searchParams.get("tag")?.toLowerCase().trim() || "";
    const difficulty =
      url.searchParams.get("difficulty")?.toLowerCase().trim() || "";
    const limit = Number.parseInt(url.searchParams.get("limit") || "20");
    const offset = Number.parseInt(url.searchParams.get("offset") || "0");

    let filteredPosts = publishedPosts;

    // カテゴリフィルタ
    if (category) {
      filteredPosts = filteredPosts.filter((post) =>
        post.data.category?.toLowerCase().includes(category),
      );
    }

    // タグフィルタ
    if (tag) {
      filteredPosts = filteredPosts.filter((post) =>
        post.data.tags?.some((t) => t.toLowerCase().includes(tag)),
      );
    }

    // 難易度フィルタ
    if (difficulty) {
      filteredPosts = filteredPosts.filter(
        (post) => post.data.difficulty?.toLowerCase() === difficulty,
      );
    }

    // テキスト検索
    if (query) {
      filteredPosts = filteredPosts.filter((post) => {
        const searchText = [
          post.data.title,
          post.data.description,
          ...(post.data.tags || []),
          post.data.category,
          ...(post.data.keywords || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchText.includes(query);
      });
    }

    // 関連度スコアを計算（検索クエリがある場合）
    if (query) {
      filteredPosts = filteredPosts
        .map((post) => {
          let score = 0;
          const title = post.data.title.toLowerCase();
          const description = post.data.description.toLowerCase();
          const tags = (post.data.tags || []).join(" ").toLowerCase();

          // タイトルマッチは高スコア
          if (title.includes(query)) {
            score += title === query ? 100 : 50;
          }

          // 説明文マッチ
          if (description.includes(query)) {
            score += 20;
          }

          // タグマッチ
          if (tags.includes(query)) {
            score += 30;
          }

          // 完全一致ボーナス
          if (title === query || tags.split(" ").includes(query)) {
            score += 50;
          }

          return { ...post, searchScore: score };
        })
        .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
    } else {
      // 検索クエリがない場合は日付順
      filteredPosts.sort(
        (a, b) =>
          new Date(b.data.publishedAt).getTime() -
          new Date(a.data.publishedAt).getTime(),
      );
    }

    // ページネーション
    const total = filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    // レスポンス用データを整形
    const results = paginatedPosts.map((post) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      category: post.data.category,
      tags: post.data.tags || [],
      difficulty: post.data.difficulty,
      readingTime: post.data.readingTime,
      publishedAt: post.data.publishedAt.toISOString(),
      emoji: post.data.emoji,
      thumbnail: post.data.thumbnail,
      wordCount: post.data.wordCount,
      searchScore: (post as any).searchScore || 0,
    }));

    // 検索統計
    const stats = {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      query: query || null,
      filters: {
        category: category || null,
        tag: tag || null,
        difficulty: difficulty || null,
      },
      categories: [...new Set(filteredPosts.map((p) => p.data.category))],
      tags: [...new Set(filteredPosts.flatMap((p) => p.data.tags || []))],
      difficulties: [...new Set(filteredPosts.map((p) => p.data.difficulty))],
    };

    return new Response(
      JSON.stringify({
        success: true,
        results,
        stats,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300", // 5分キャッシュ
        },
      },
    );
  } catch (error) {
    console.error("Search API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
