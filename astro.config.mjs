import sitemap from "@astrojs/sitemap";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://hakozaki.dev", // 本番デプロイ時に実際のドメインに変更
  integrations: [
    sitemap({
      // 除外するページ（必要に応じて追加）
      filter: (page) => !page.includes("/404") && !page.includes("/admin"),
      // サイトマップのカスタマイズ（必要に応じて）
      customPages: [
        // カスタムページがある場合はここに追加
      ],
      // i18n設定（将来的な多言語対応）
      i18n: {
        defaultLocale: "ja",
        locales: {
          ja: "ja-JP",
        },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: "prism",
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
