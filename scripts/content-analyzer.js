import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * コンテンツ分析・最適化スクリプト
 * 46個のMarkdownファイルを分析し、メタデータを標準化
 */

const CONTENT_DIR = "content/exported";
const OUTPUT_DIR = "content/optimized";
const ANALYSIS_REPORT = "content-analysis-report.json";

// カテゴリマッピング（タグベース）
const CATEGORY_MAPPING = {
  Python: "backend",
  "Next.js": "frontend",
  "Nuxt.js": "frontend",
  "React.js": "frontend",
  "Vue.js": "frontend",
  TypeScript: "frontend",
  JavaScript: "frontend",
  Docker: "devops",
  WSL2: "devops",
  Heroku: "devops",
  "AWS Amplify": "devops",
  PostgreSQL: "database",
  WordPress: "cms",
  JamStack: "architecture",
  "Chakra UI": "ui-library",
  読書メモ: "learning",
};

// 難易度判定ルール
const DIFFICULTY_RULES = {
  beginner: ["入門", "初心者", "基本", "はじめに", "導入", "tutorial"],
  intermediate: ["実装", "開発", "構築", "カスタム", "応用", "設定"],
  advanced: [
    "最適化",
    "パフォーマンス",
    "高度",
    "アーキテクチャ",
    "デプロイ",
    "CI/CD",
  ],
};

/**
 * 読了時間を計算（日本語対応）
 * @param {string} content - 記事コンテンツ
 * @returns {number} - 読了時間（分）
 */
function calculateReadingTime(content) {
  // 日本語の場合、文字数ベースで計算
  const japaneseCharsPerMinute = 400; // 日本語の平均読書速度
  const englishWordsPerMinute = 200; // 英語の平均読書速度

  // コードブロックを除外
  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");

  // 日本語文字数（ひらがな、カタカナ、漢字）
  const japaneseChars = (
    contentWithoutCode.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []
  ).length;

  // 英語単語数
  const englishWords = contentWithoutCode
    .replace(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const japaneseTime = japaneseChars / japaneseCharsPerMinute;
  const englishTime = englishWords / englishWordsPerMinute;

  return Math.max(1, Math.ceil(japaneseTime + englishTime));
}

/**
 * カテゴリを判定
 * @param {string[]} tags - タグ配列
 * @returns {string} - カテゴリ
 */
function determineCategory(tags) {
  if (!tags || tags.length === 0) return "general";

  for (const tag of tags) {
    if (CATEGORY_MAPPING[tag]) {
      return CATEGORY_MAPPING[tag];
    }
  }
  return "general";
}

/**
 * 難易度を判定
 * @param {string} title - タイトル
 * @param {string} content - コンテンツ
 * @returns {string} - 難易度
 */
function determineDifficulty(title, content) {
  const text = `${title} ${content}`.toLowerCase();

  for (const [level, keywords] of Object.entries(DIFFICULTY_RULES)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return level;
    }
  }

  // デフォルトは中級
  return "intermediate";
}

/**
 * descriptionを生成
 * @param {string} content - コンテンツ
 * @returns {string} - 生成されたdescription
 */
function generateDescription(content) {
  // 最初の段落を取得（# はじめに の後など）
  const paragraphs = content
    .replace(/^---[\s\S]*?---/, "") // フロントマター除去
    .replace(/^#[^#].*$/gm, "") // h1見出し除去
    .split("\n\n")
    .filter((p) => p.trim().length > 0)
    .map((p) => p.replace(/\n/g, " ").trim());

  if (paragraphs.length > 0) {
    const firstParagraph = paragraphs[0];
    // 150文字以内に制限
    return firstParagraph.length > 150
      ? `${firstParagraph.substring(0, 147)}...`
      : firstParagraph;
  }

  return "この記事では、実践的な開発手法について詳しく解説しています。";
}

/**
 * 単一ファイルを処理
 * @param {string} filePath - ファイルパス
 * @returns {Object} - 処理結果
 */
async function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(content);
  const { data: frontmatter, content: markdownContent } = parsed;

  // 現在のメタデータを分析
  const analysis = {
    originalFile: path.basename(filePath),
    hasDescription: !!frontmatter.description,
    hasCategory: !!frontmatter.category,
    hasReadingTime: !!frontmatter.readingTime,
    hasDifficulty: !!frontmatter.difficulty,
    wordCount: markdownContent.length,
    tags: frontmatter.tags || [],
  };

  // 新しいメタデータを生成
  const enhancedFrontmatter = {
    ...frontmatter,
    description:
      frontmatter.description || generateDescription(markdownContent),
    category: frontmatter.category || determineCategory(frontmatter.tags),
    readingTime:
      frontmatter.readingTime || calculateReadingTime(markdownContent),
    difficulty:
      frontmatter.difficulty ||
      determineDifficulty(frontmatter.title, markdownContent),
    wordCount: markdownContent.length,
    lastOptimized: new Date().toISOString(),
  };

  // 最適化されたファイルを出力
  const optimizedContent = matter.stringify(
    markdownContent,
    enhancedFrontmatter,
  );
  const outputPath = path.join(OUTPUT_DIR, path.basename(filePath));

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(outputPath, optimizedContent, "utf-8");

  return {
    ...analysis,
    enhanced: enhancedFrontmatter,
    outputPath,
  };
}

/**
 * 全ファイルを処理
 */
async function processAllFiles() {
  console.log("🚀 コンテンツ分析・最適化を開始...");

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(CONTENT_DIR, file));

  console.log(`📁 ${files.length}個のファイルを処理します`);

  const results = [];
  const summary = {
    totalFiles: files.length,
    processedFiles: 0,
    categories: {},
    difficulties: {},
    averageReadingTime: 0,
    totalWordCount: 0,
  };

  for (const filePath of files) {
    try {
      console.log(`📄 処理中: ${path.basename(filePath)}`);
      const result = await processFile(filePath);
      results.push(result);

      // 統計情報を更新
      summary.processedFiles++;
      summary.categories[result.enhanced.category] =
        (summary.categories[result.enhanced.category] || 0) + 1;
      summary.difficulties[result.enhanced.difficulty] =
        (summary.difficulties[result.enhanced.difficulty] || 0) + 1;
      summary.totalWordCount += result.wordCount;
    } catch (error) {
      console.error(`❌ エラー: ${path.basename(filePath)} - ${error.message}`);
    }
  }

  // 平均読了時間を計算
  summary.averageReadingTime = Math.round(
    results.reduce((sum, r) => sum + r.enhanced.readingTime, 0) /
      results.length,
  );

  // 分析レポートを生成
  const report = {
    summary,
    processedAt: new Date().toISOString(),
    files: results,
  };

  fs.writeFileSync(ANALYSIS_REPORT, JSON.stringify(report, null, 2), "utf-8");

  console.log("\n✅ 処理完了!");
  console.log(`📊 統計情報:`);
  console.log(
    `   - 処理済みファイル: ${summary.processedFiles}/${summary.totalFiles}`,
  );
  console.log(`   - 平均読了時間: ${summary.averageReadingTime}分`);
  console.log(`   - 総文字数: ${summary.totalWordCount.toLocaleString()}文字`);
  console.log(`   - カテゴリ分布:`, summary.categories);
  console.log(`   - 難易度分布:`, summary.difficulties);
  console.log(`📁 最適化ファイル: ${OUTPUT_DIR}/`);
  console.log(`📋 分析レポート: ${ANALYSIS_REPORT}`);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllFiles().catch(console.error);
}

export {
  processAllFiles,
  calculateReadingTime,
  determineCategory,
  determineDifficulty,
};
