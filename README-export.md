# NEWT Content Export to Markdown

NEWTで管理しているコンテンツをMarkdown形式でローカルに保存するためのツールです。

## 使用方法

### 全記事をエクスポート
```bash
npm run export-md all
```

### 特定の記事をエクスポート（スラッグ指定）
```bash
npm run export-md single <slug>
```

## 機能

- NEWTのコンテンツをMarkdown形式に変換
- フロントマター付きのMarkdownファイル生成
- HTMLからMarkdownへの自動変換
- 記事のメタデータ（タイトル、タグ、カテゴリ等）を保持
- バッチ処理による一括エクスポート

## 出力形式

生成されるMarkdownファイルは以下の形式になります：

```markdown
---
title: "記事タイトル"
slug: "article-slug"
description: "記事の説明"
author: "作者名"
publishedAt: "2023-01-01"
tags: ["tag1", "tag2"]
categories: ["category1"]
emoji: "📝"
thumbnail: "https://example.com/image.jpg"
---

# 記事の内容

ここに記事の本文がMarkdown形式で出力されます...
```

## 出力先

エクスポートされたファイルは `./content/exported/` ディレクトリに保存されます。

## 注意事項

- NEWTのAPIキーが設定されている必要があります（.envファイル）
- インターネット接続が必要です
- 大量の記事をエクスポートする場合は時間がかかる場合があります