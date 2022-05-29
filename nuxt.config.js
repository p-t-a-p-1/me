// require('dotenv').config
import { createClient } from 'newt-client-js'
import cheerio from 'cheerio'
import hljs from 'highlight.js'
const {
  SPACE_U_ID,
  TOKEN,
  BLOG_APP_U_ID,
  BLOG_APP_ARTICLE_MODEL_ID,
  G_TAG_ID,
} = process.env
export default {
  srcDir: './src',
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | ptap1',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          '札幌市在住のフロントエンドエンジニアのブログサイトです。主にVue.jsやNuxtJSの記事を書いております。',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'ptap1',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.ptap1.com',
      },
      { hid: 'og:title', property: 'og:title', content: 'ptap1' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '',
      },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@mavs_hako' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/common.scss',
    'github-markdown-css',
    '@@/node_modules/highlight.js/styles/hybrid.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/repository.ts',
    '~/plugins/dateFilter.ts',
    '~/plugins/veeValidate.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Montserrat: [400, 700],
          'Noto Sans JP': [400, 700],
        },
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'nuxt-svg-loader',
    '@nuxtjs/dayjs',
    [
      '@nuxtjs/google-gtag',
      {
        id: G_TAG_ID,
        debug: false,
      },
    ],
    '@nuxtjs/sitemap',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate'],
  },

  styleResources: {
    scss: ['~/assets/scss/_variables.scss'],
  },

  // APIKeyはサーバーサイドでのみ使用される
  privateRuntimeConfig: {
    spaceUId: SPACE_U_ID,
    token: TOKEN,
    blogAppUId: BLOG_APP_U_ID,
    blogAppModelId: BLOG_APP_ARTICLE_MODEL_ID,
  },

  // ローカルや検証環境の場合はクライアントサイドでもKey使えるように
  publicRuntimeConfig: {
    spaceUid: SPACE_U_ID,
    appUid: BLOG_APP_U_ID,
    token: TOKEN,
    apiType: 'cdn',
    blogAppModelId: BLOG_APP_ARTICLE_MODEL_ID,
  },

  dayjs: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    defaultTimeZone: 'Asia/Tokyo',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone', // import 'dayjs/plugin/timezone'
    ],
  },

  generate: {
    interval: 100,
    async routes() {
      const client = createClient({
        spaceUid: SPACE_U_ID,
        token: TOKEN,
        apiType: 'cdn',
      })
      return await client
        .getContents({
          appUid: BLOG_APP_U_ID,
          modelUid: BLOG_APP_ARTICLE_MODEL_ID,
        })
        .then((response) => {
          const blogData = response.items
          const blogRoutes = blogData.map(async (item) => {
            const $ = cheerio.load(item.body)
            await $('pre code').each((_, elm) => {
              const result = hljs.highlightAuto($(elm).text())
              $(elm).html(result.value)
              $(elm).addClass('hljs')
            })
            return {
              route: `/blog/posts/${item.slug}`,
              payload: { main: item, body: $.html() },
            }
          })
          return [
            {
              route: '/blog',
              payload: response,
            },
            ...blogRoutes,
          ]
        })
    },
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://www.ptap1.com/',
    async routes() {
      const client = createClient({
        spaceUid: SPACE_U_ID,
        token: TOKEN,
        apiType: 'cdn',
      })
      return await client
        .getContents({
          appUid: BLOG_APP_U_ID,
          modelUid: BLOG_APP_ARTICLE_MODEL_ID,
        })
        .then((response) => {
          const blogData = response.items
          const blogRoutes = blogData.map((item) => {
            return {
              url: `/blog/posts/${item.slug}`,
              priority: 0.8,
              lastmod: item._sys.updatedAt,
            }
          })
          return blogRoutes
        })
    },
    gzip: true,
    trailingSlash: false,
  },
}
