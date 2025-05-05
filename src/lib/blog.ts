interface BlogContent {
  type: "text" | "code" | "image";
  content: string;
  language?: string;
  alt?: string;
}

export interface Blog {
  slug: string;
  title: string;
  emoji: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  content: BlogContent[];
  toc?: {
    text: string;
    id: string;
    level: number;
  }[];
}

// 仮のデータ
const blogs: Blog[] = [
  {
    slug: "nextjs-dotenv-cli",
    title: "Next.jsの環境変数問題、dotenv-cliでOS（Mac/Windows）問わず解決！",
    emoji: "⚙️",
    date: "2024-04-24",
    updatedAt: "2024-04-25",
    tags: ["Next.js", "環境変数", "dotenv-cli"],
    content: [
      {
        type: "text",
        content:
          "Next.jsプロジェクトで環境変数を扱う際に、OSによって挙動が異なる問題が発生することがあります。",
      },
      {
        type: "image",
        content: "https://placehold.co/600x400",
        alt: "環境変数の設定例",
      },
      {
        type: "code",
        content:
          "NEXT_PUBLIC_API_URL=https://api.example.com\nNEXT_PUBLIC_APP_ENV=development",
        language: "plaintext",
      },
      {
        type: "text",
        content:
          "この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。この問題を解決するために、dotenv-cliを使用する方法を紹介します。",
      },
    ],
    toc: [
      { text: "はじめに", id: "introduction", level: 1 },
      { text: "環境変数の問題", id: "env-problem", level: 2 },
      { text: "dotenv-cliの導入", id: "install-dotenv-cli", level: 2 },
    ],
  },
  {
    slug: "astro-blog",
    title: "Astroでブログを作成する方法",
    emoji: "🚀",
    date: "2024-04-25",
    tags: ["Astro", "ブログ", "Web開発"],
    content: [
      {
        type: "text",
        content:
          "Astroは、静的サイトジェネレーターとして人気が高まっています。特にブログサイトの作成に適しています。",
      },
      {
        type: "code",
        content: "npm create astro@latest\ncd my-blog\nnpm run dev",
        language: "bash",
      },
      {
        type: "text",
        content:
          "このコマンドで、新しいAstroプロジェクトを作成し、開発サーバーを起動できます。",
      },
    ],
    toc: [
      { text: "Astroとは", id: "what-is-astro", level: 1 },
      { text: "プロジェクトの作成", id: "create-project", level: 2 },
      { text: "ブログの実装", id: "implement-blog", level: 2 },
    ],
  },
];

export function getBlogBySlug(slug: string | undefined): Blog | undefined {
  if (!slug) return undefined;
  return blogs.find((blog) => blog.slug === slug);
}

export function getAllBlogs(): Blog[] {
  return blogs;
}
