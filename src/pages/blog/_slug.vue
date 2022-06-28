<template>
  <transition name="fade-fast">
    <article class="article">
      <header class="article__header">
        <div v-if="article.emoji" class="article__header__emoji">
          {{ article.emoji.value }}
        </div>
        <h1 class="article__header__title">
          {{ article.title }}
        </h1>
        <div v-if="article._sys" class="article__header__date">
          <p>{{ article._sys.updatedAt | dateFilter }}</p>
        </div>
        <ul
          v-if="article.categories && article.categories.length >= 1"
          class="article__header__categories"
        >
          <li
            v-for="(category, categoryIndex) in article.categories"
            :key="`category-${categoryIndex}`"
          >
            #{{ category.name }}
          </li>
        </ul>
      </header>

      <!-- eslint-disable vue/no-v-html -->
      <main
        v-if="articleBody"
        class="article__main markdown-body"
        v-html="articleBody"
      />
      <footer class="article__footer">
        <nuxt-link to="/blog" class="article__footer__link">
          Blog一覧へ
        </nuxt-link>
      </footer>
    </article>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import cheerio from 'cheerio'
import hljs from 'highlight.js'
export default Vue.extend({
  name: 'BlogDetailPage',
  async asyncData({ app, payload, route, error }) {
    const postSlug = route.params.slug

    // 記事情報取得
    const article =
      payload ||
      (await app
        .$repositories('blog')
        .findOne(postSlug)
        .then((response: any) => {
          if (response.total === 0) {
            error({
              statusCode: 404,
              message: 'not found',
            })
            return {}
          }
          return response.items[0]
        })
        .catch(() => {
          // 取得できない場合はエラーページへ遷移
          error({
            statusCode: 404,
            message: 'not found',
          })
        }))

    if (article === undefined || Object.keys(article).length === 0) {
      error({
        statusCode: 404,
        message: 'not found',
      })
      return
    }

    const title = article.meta.title
    const pageDescription = article.meta.description

    const bodyHighlight = (body: string): string => {
      // コードのシンタックスハイライト付与
      const $ = cheerio.load(body)
      $('pre code').each((_, elm) => {
        const result = hljs.highlightAuto($(elm).text())
        $(elm).html(result.value)
        $(elm).addClass('hljs')
      })
      return $.html()
    }

    const articleBody = payload ? payload.body : bodyHighlight(article.body)

    return {
      article,
      articleBody,
      title,
      pageDescription,
    }
  },
  data() {
    return {
      title: '',
      pageDescription: '',
    }
  },
  head(this: { title: string; pageDescription: string }) {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDescription,
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.article {
  &__header {
    &__emoji {
      font-size: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    &__title {
      margin-top: 32px;
      font-size: 3rem;
      letter-spacing: 0.04em;
      color: $colorCorporateMain;
      text-align: center;
    }
    &__date {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      column-gap: 16px;
      row-gap: 8px;
    }
    &__categories {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      column-gap: 8px;
      row-gap: 8px;
    }
  }
  &__main {
    margin-top: 32px;
    background-color: $colorWhite;
    padding: 3rem;
    border-radius: 8px;
  }
  &__footer {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    &__link {
      color: $colorCorporateMain;
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.markdown-body {
  color: $colorBaseText;
  font-family: $baseFontFamily;
  &::v-deep {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 40px;
      color: $colorCorporateMain;
    }
    h1 {
      border-bottom: 3px solid $colorCorporateMain;
      padding: 0.3em 0;
    }
    h2 {
      border-left: 5px solid $colorCorporateMain;
      border-bottom: none;
      padding: 0.1em 0.1em 0.1em 0.3em;
    }
    p {
      line-height: 2;
    }
    pre {
      color: $colorWhite;
      background-color: $colorBaseText;
    }
    table {
      tr {
        background-color: $colorWhite;
      }
    }
    ul {
      list-style-type: disc;
    }
  }
}
</style>
