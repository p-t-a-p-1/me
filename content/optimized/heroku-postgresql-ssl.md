---
title: HerokuのPostgreSQLにSSL接続する
slug: heroku-postgresql-ssl
description: >-
  error: no pg_hba.conf entry for host DB_HOST, user DB_USER, database DB, SSL
  offのエラー解決の記事です。
publishedAt: '2020-04-24T15:00:00.000Z'
tags:
  - Heroku
  - PostgreSQL
categories: []
emoji: "\U0001F41B"
category: devops
readingTime: 1
difficulty: intermediate
wordCount: 507
lastOptimized: '2025-06-26T15:10:08.245Z'
---

短いですが備忘録として残しておきます！

## エラー

Node.jsのORM（Object Relation Mapping）であるSequelizeを利用して、  
ローカルからHerokuのPostgreSQLに接続する際に下記のエラーが出て接続できませんでした。。

```
error: no pg_hba.conf entry for host "DB_HOST", user "DB_USER", database "DB", SSL off
```

これはSSL接続がオフになっているためオプションでオンにしてあげる必要があります。

## 解決

```javascript
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  'postgres://~~', // DB情報
  {
    // DBにSSL接続する
    dialectOptions: {
      ssl: true,
    },
  }
)
```

上記のようにSSL接続をtrueとすることで解決しました！
