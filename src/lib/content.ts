import node_fs from "node:fs/promises";
import node_path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-python.js";
import type { Article, Tag } from "./newt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = node_path.dirname(__filename);

const CONTENT_DIR = node_path.join(__dirname, "../../content/exported");
const TAGS_FILE = node_path.join(__dirname, "../../content/tags.json");

// Markedの設定
marked.use(
  markedHighlight({
    highlight(code, lang) {
      if (lang && Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      }
      return code;
    },
  }),
);

export interface LocalTag {
  id: string;
  name: string;
  slug: string;
}

export interface LocalArticle {
  title: string;
  slug: string;
  emoji: string;
  date: string;
  url: string;
  thumbnail: string;
  tags: string[];
  body: string;
}

export async function getAllLocalArticles(): Promise<LocalArticle[]> {
  try {
    const files = await node_fs.readdir(CONTENT_DIR);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const articles: LocalArticle[] = [];

    for (const file of markdownFiles) {
      const filePath = node_path.join(CONTENT_DIR, file);
      const fileContent = await node_fs.readFile(filePath, "utf-8");
      const { data: frontmatter, content: body } = matter(fileContent);

      // PrismハイライトでMarkdownをHTMLに変換
      const htmlBody = await marked(body, {
        breaks: true,
        gfm: true,
      });

      articles.push({
        title: frontmatter.title || "",
        slug: frontmatter.slug || node_path.basename(file, ".md"),
        emoji: frontmatter.emoji || "",
        date: frontmatter.publishedAt || frontmatter.date || "",
        url: frontmatter.url || "",
        thumbnail: frontmatter.thumbnail || "",
        tags: frontmatter.tags || [],
        body: htmlBody,
      });
    }

    // 日付順でソート（新しい順）
    articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return articles;
  } catch (error) {
    console.error("記事の読み込みエラー:", error);
    return [];
  }
}

export async function getLocalArticleBySlug(
  slug: string,
): Promise<LocalArticle | null> {
  try {
    const articles = await getAllLocalArticles();
    return articles.find((article) => article.slug === slug) || null;
  } catch (error) {
    console.error("記事の取得エラー:", error);
    return null;
  }
}

export async function getAllLocalTags(): Promise<LocalTag[]> {
  try {
    const tagsContent = await node_fs.readFile(TAGS_FILE, "utf-8");
    return JSON.parse(tagsContent);
  } catch (error) {
    console.error("タグの読み込みエラー:", error);
    return [];
  }
}

export async function getArticlesByTag(
  tagName: string,
): Promise<LocalArticle[]> {
  try {
    const articles = await getAllLocalArticles();
    return articles.filter((article) =>
      article.tags.some((tag) => tag.toLowerCase() === tagName.toLowerCase()),
    );
  } catch (error) {
    console.error("タグ別記事の取得エラー:", error);
    return [];
  }
}

// NEWT形式のArticle型にマッピング（既存コードとの互換性のため）
export function mapToNewtArticle(localArticle: LocalArticle): Article {
  return {
    title: localArticle.title,
    url: localArticle.url,
    slug: localArticle.slug,
    meta: {
      title: localArticle.title,
      description: localArticle.body.substring(0, 200),
      ogImage: {
        src: localArticle.thumbnail,
      },
    },
    body: localArticle.body,
    author: "",
    categories: [],
    emoji: {
      type: "emoji",
      value: localArticle.emoji,
    },
    pDate: localArticle.date,
    tags: localArticle.tags.map((tagName) => ({
      _id: tagName,
      name: tagName,
      slug: tagName.toLowerCase().replace(/\s+/g, "-"),
    })),
    thumbnail: {
      src: localArticle.thumbnail,
    },
  };
}
