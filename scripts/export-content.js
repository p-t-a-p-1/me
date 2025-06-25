import { createClient } from "newt-client-js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newtClient = createClient({
  spaceUid: process.env.NEWT_SPACE_UID,
  token: process.env.NEWT_CDN_API_TOKEN,
  apiType: "cdn",
});

const CONTENT_DIR = path.join(__dirname, "../content");
const IMAGES_DIR = path.join(__dirname, "../public/images");

async function ensureDirectories() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(IMAGES_DIR, filename));
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on("finish", () => {
        file.close();
        resolve(filename);
      });
      
      file.on("error", (err) => {
        fs.unlink(path.join(IMAGES_DIR, filename));
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

function sanitizeFilename(filename) {
  return filename
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .toLowerCase();
}

async function processImages(body, articleSlug) {
  let processedBody = body;
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const matches = [...body.matchAll(imageRegex)];
  
  for (const match of matches) {
    const imageUrl = match[1];
    
    if (imageUrl.startsWith("http")) {
      try {
        const urlParts = new URL(imageUrl);
        const extension = path.extname(urlParts.pathname) || ".jpg";
        const filename = `${articleSlug}-${Date.now()}${extension}`;
        
        await downloadImage(imageUrl, filename);
        
        processedBody = processedBody.replace(
          imageUrl,
          `/images/${filename}`
        );
        
        console.log(`画像をダウンロードしました: ${filename}`);
      } catch (error) {
        console.error(`画像のダウンロードに失敗しました: ${imageUrl}`, error);
      }
    }
  }
  
  return processedBody;
}

async function exportArticles() {
  try {
    console.log("記事を取得中...");
    
    const { items: articles } = await newtClient.getContents({
      appUid: "meBlog",
      modelUid: "article",
      query: {
        select: [
          "title",
          "slug",
          "body",
          "emoji",
          "pDate",
          "url",
          "thumbnail",
          "tags",
        ],
        order: ["-pDate"],
      },
    });

    console.log(`${articles.length}件の記事を取得しました`);

    for (const article of articles) {
      console.log(`処理中: ${article.title}`);
      
      // 画像を処理
      const processedBody = await processImages(article.body, article.slug);
      
      // サムネイル画像をダウンロード
      let thumbnailPath = "";
      if (article.thumbnail?.src) {
        try {
          const thumbnailUrl = article.thumbnail.src;
          const urlParts = new URL(thumbnailUrl);
          const extension = path.extname(urlParts.pathname) || ".jpg";
          const thumbnailFilename = `${article.slug}-thumbnail${extension}`;
          
          await downloadImage(thumbnailUrl, thumbnailFilename);
          thumbnailPath = `/images/${thumbnailFilename}`;
          
          console.log(`サムネイルをダウンロードしました: ${thumbnailFilename}`);
        } catch (error) {
          console.error(`サムネイルのダウンロードに失敗しました: ${article.thumbnail.src}`, error);
        }
      }

      // Markdownファイルとして保存
      const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
slug: "${article.slug}"
emoji: "${article.emoji?.value || ""}"
date: "${article.pDate}"
url: "${article.url || ""}"
thumbnail: "${thumbnailPath}"
tags: [${article.tags?.map(tag => `"${tag.name}"`).join(", ") || ""}]
---

`;

      const markdownContent = frontmatter + processedBody;
      const filename = `${sanitizeFilename(article.slug)}.md`;
      
      await fs.writeFile(
        path.join(CONTENT_DIR, filename),
        markdownContent,
        "utf-8"
      );
      
      console.log(`Markdownファイルを作成しました: ${filename}`);
    }

    console.log("エクスポート完了！");
  } catch (error) {
    console.error("エクスポート中にエラーが発生しました:", error);
  }
}

async function exportTags() {
  try {
    console.log("タグを取得中...");
    
    const { items: tags } = await newtClient.getContents({
      appUid: "meBlog",
      modelUid: "tag",
    });

    const tagData = tags.map(tag => ({
      id: tag._id,
      name: tag.name,
      slug: tag.slug,
    }));

    await fs.writeFile(
      path.join(CONTENT_DIR, "tags.json"),
      JSON.stringify(tagData, null, 2),
      "utf-8"
    );

    console.log(`${tags.length}件のタグを保存しました`);
  } catch (error) {
    console.error("タグのエクスポート中にエラーが発生しました:", error);
  }
}

async function main() {
  await ensureDirectories();
  await exportArticles();
  await exportTags();
}

main().catch(console.error);