---
title: "Vue.jsで超簡易的な映画検索アプリを作ってみた"
slug: "vue-movie"
description: "Reactを使って映画検索アプリを作成する というものをVue.js（Vue CLI）で簡易的に作ってみたものです。"
publishedAt: "2020-07-08T15:00:00.000Z"
tags: ["Vue.js"]
categories: []
emoji: "🎥"
---

# はじめに

この記事は『[2020年のフロントエンドマスターになりたければこの9プロジェクトを作れ](https://qiita.com/rana_kualu/items/915345b8f3f870cfe2aa) 』で紹介されていた

最初の  
「Build a movie search app using React (with hooks)」 = Reactを使って映画検索アプリを作成する  
というものをVue.js（Vue CLI）で簡易的に作ってみたものです。

# 完成したもの

![search-movie.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/462329/e8c43ac9-ac55-0772-4dac-dc5d011b25e2.gif)

この8ビット風のcssは[NES.css](https://nostalgic-css.github.io/NES.css/)を利用させていただきました！

![スクリーンショット 2020-07-09 22.28.38.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/462329/4b6dbfeb-2d7b-3c90-cb33-dcf00c9b1873.png)

# APIについて

[OMDb API](https://www.omdbapi.com/)という映画検索APIを用いました。

```
https://www.omdbapi.com/?apikey=[yourkey]&s=hero
```

s=\[検索したい文字列\]で下記のようなjsonが返ってきます。

![スクリーンショット 2020-07-09 22.22.28.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/462329/b75c42d9-bd52-f99b-ea96-b0bb62cfce4b.png)

※映画のポスター画像も取得できるのが便利です！

# コード

## Vue.js

[vue-magic-grid](https://github.com/e-oj/vue-magic-grid)と呼ばれる簡単にタイル状に並べてくれるライブラリを用います。

```Movie.js
import MagicGrid from 'vue-magic-grid'
import Vue from 'vue'

let baseUrl = 'https://www.omdbapi.com/?apikey=[yourkey]'
export default {
  name: 'movie',
  data () {
    return {
      searchStr: '',
      results: []
    }
  },
  methods: {
    // クリック時発火
    onClick: function() {
      // 何も入力されていない場合はAPI叩かない
      if (this.searchStr === '') {
          return
      }
      // 検索用のURL作成
      baseUrl = baseUrl + '&s=' + this.searchStr
      // axiosで非同期通信
      this.axios.get(baseUrl)
      .then(response => {
          this.results = response.data.Search
          Vue.use(MagicGrid)
      })
    }
  }
}
```

## HTML&CSS

`v-model`を用いてテキストボックスの値（searchStr）を双方向データバインディングします。  
ボタンでAPIを叩いて結果を表示してます。

```HTML
<div class="movie">
  <!-- 検索ボックス -->
  <div class="nes-field search-box">
      <input type="text" id="name_field" class="nes-input search-box__input" v-model="searchStr" placeholder="enter movie title" />
      <button type="button" class="nes-btn search-box__btn" @click="onClick">Search</button>
  </div>

  <magic-grid class="posts-list">
    <!-- 単体 -->
    <div class="posts-item nes-container with-title is-centered" v-for="(post, index) in results" :key="index">
      <p class="title">{{post.Title}}</p>
      <p>{{post.Year}}</p>
      <img :src="post.Poster" :alt="post.Title">
    </div>
  </magic-grid>
</div>
```

```scss
.search-box {
  display: flex;
  &__input {
    width: 80%;
  }
  &__btn {
    width: 20%;
  }
}
.posts-list {
  margin-top: 2.5rem;
}
.posts-item {
  img {
    width: 100%;
  }
}
```

# 終わり

こんな感じで映画のポスター付きで表示することができます！  
[コードはこちら](https://github.com/p-t-a-p-1/vue-tools/blob/master/src/views/Movie.vue)

![screencapture-localhost-8080-movie-2020-07-09-23_05_52.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/462329/2559a30f-b92d-4444-ac62-4783d539f773.png)