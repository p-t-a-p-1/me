---
title: Nuxt.jsの初期コマンドについて
slug: nuxt-commands
description: Nuxtのプロジェクト構築時には以下のコマンドが叩けるようになってます。
publishedAt: '2022-07-10T15:00:00.000Z'
tags:
  - Nuxt.js
categories: []
emoji: "\U0001F347"
category: frontend
readingTime: 2
difficulty: beginner
wordCount: 2155
lastOptimized: '2025-06-26T15:10:08.246Z'
---

Nuxtのプロジェクト構築時には以下のコマンドが叩けるようになってます。

npmコマンドの場合は `npm run ${key}` 、  
Yarnコマンドの場合は `yarn ${key}` で各種コマンドが実行できるようになります

例：キーが `dev` の場合

npmコマンドの場合は `npm run dev` 、  
Yarnコマンドの場合は `yarn dev` で `nuxt` コマンドを実行することができます。

```jsx
...
"scripts": {
  "dev": "nuxt",
  "build": "nuxt build",
  "start": "nuxt start",
  "generate": "nuxt generate",
  "lint:js": "eslint --ext \".js,.vue\" --ignore-path .gitignore .",
  "lint": "yarn lint:js",
  "lintfix": "yarn lint:js --fix"
},
...
```

```json
...
"scripts": {
  "dev": "nuxt",
  "build": "nuxt build",
  "start": "nuxt start",
  "generate": "nuxt generate",
  "lint:js": "eslint --ext \".js,.vue\" --ignore-path .gitignore .",
  "lint": "yarn lint:js",
  "lintfix": "yarn lint:js --fix"
},
...
```

※ プロジェクトを落とすときは ctrl + c

* * *

# 初期コマンドについて

## `dev`

→ 開発サーバーをlocalhostの3000ポートで起動

ホットリロード機能があることから、基本的に開発する際はこちらを実行します。

## `build`

→ アプリケーションをwebpackでビルドし、JSとCSSをミニファイ化

本番用のアプリケーションをビルドするためのもので、SSRのときに使う

### 解析

※ `nuxt build --analyze` でプロジェクトに対してどのライブラリがどれくらいの割合を占めているか可視化することができます。

これは不要ライブラリを見つけたり、  
大きいライブラリは代替できるライブラリがあるか検討するために使うことがあります。

![nuxt-commands-1.png](https://storage.googleapis.com/p_6227542ad33be40018293aff/6723a64c-b0ad-453d-a396-2a5eb6f781d2/1000x1000/nuxt-commands-1.png)

![nuxt-commands-2.png](https://storage.googleapis.com/p_6227542ad33be40018293aff/5951bb0d-51bd-4c0b-9bba-ab9c68759a3d/1000x1000/nuxt-commands-2.png)

→ ファイルが出力されます

## `start`

→ アプリケーションを本番用で起動

SSGの場合は、dist/ 内をルートとして起動される  
→ デプロイ前のローカルテストに使う

## `generate`

→ ビルドして、dist/ に静的にファイル出力する

SSGのときに使う

## `lint:js`

ESLintでのコードチェック

不要なカンマだったりh2タグ内のテキストが改行されていないなどのコードのエラーが表示されます。

![nuxt-commands-3.png](https://storage.googleapis.com/p_6227542ad33be40018293aff/bb5cd38c-d082-49e8-95b5-67d7a3873928/1000x1000/nuxt-commands-3.png)

## `lint`

こちらもESLintでのコードチェック

コマンド見ると `yarn lint:js` を実行しているので上記と同じ

![nuxt-commands-4.png](https://storage.googleapis.com/p_6227542ad33be40018293aff/a5e58413-ee4f-44d1-a6bd-9bc8c6c43142/1000x1000/nuxt-commands-4.png)

lint:js での実行結果と同じになっている

## `lintfix`

Lintエラーを一括で治してくれる

`yarn dev` で開発してるときや `yarn lint` で出てくるLintエラーを  
一つずつ手作業で治すのは大変です..

一括整形してくれるのでよく使うことが多いです
