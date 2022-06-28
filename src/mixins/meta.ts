// eslint-disable-next-line import/named
import { MetaInfo } from 'vue-meta'
/**
 * 動的ページのmeta周り調整
 * @use asyncDataで記事情報を取得したあと、以下のようにmetaを追加
 * @example
 *   return {
 *     meta: {
 *       title: '', // 記事タイトル
 *       description: '', // 本文（HTMLタグ含むもの）
 *       ogImage: '', // アイキャッチ画像あれば画像パス
 *       ogUrl: '', // 表示中のURL
 *       ogType: '', // ※ オプション：基本は設定しない
 *       twitterCard: '', // ※ オプション：基本は設定しない
 *     }
 *   }
 */

export default {
  head(this: any): MetaInfo {
    return {
      title: this.meta.title ?? '北海道札幌市のフロントエンドエンジニア',
      titleTemplate: this.meta.isTitleTemplate
        ? undefined
        : '%s｜北海道札幌市のフロントエンドエンジニア｜ptap1',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.meta.description ??
            '札幌市在住のフロントエンドエンジニアのブログサイトです。主にVue.jsやNuxtJSの記事を書いております。',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.meta.title ?? '北海道札幌市のフロントエンドエンジニア',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.meta.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.meta.ogImage ?? 'https://ptap1.com/ogp.png',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.meta.ogUrl ?? '',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: this.meta.ogType ?? 'website',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.meta.title ?? '北海道札幌市のフロントエンドエンジニア',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.meta.description,
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: this.meta.twitterCard ?? 'summary_large_image',
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.meta.ogImage ?? 'https://ptap1.com/ogp.png',
        },
      ],
    }
  },
}
