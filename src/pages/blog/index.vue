<template>
  <div>
    <page-title label="POSTS" />
    <div>
      <div
        v-for="(article, articleIndex) in articles"
        :key="`article-${articleIndex}`"
        class="card"
      >
        <nuxt-link :to="`/blog/${article.slug}`" class="card__link">
          <div v-if="article.emoji" class="card__emoji">
            {{ article.emoji.value }}
          </div>
          <div class="card__info">
            <h3 class="card__title">
              {{ article.title }}
            </h3>
            <div class="card__detail">
              <p v-if="article._sys" class="card__date">
                {{ article._sys.updatedAt | dateFilter }}
              </p>
              <ul
                v-if="article.categories && article.categories.length >= 1"
                class="card__tags"
              >
                <li
                  v-for="(category, categoryIndex) in article.categories"
                  :key="`article-${articleIndex}-category-${categoryIndex}`"
                >
                  #{{ category.name }}
                </li>
              </ul>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  async asyncData({ app, payload }) {
    const result = payload || (await app.$repositories('blog').findList())

    return {
      articles: result.items,
    }
  },
  head() {
    return {
      title: '記事一覧',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            '札幌市在住のフロントエンドエンジニアのブログサイトです。主にVue.jsやNuxtJSの記事を書いております。',
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  & + & {
    margin-top: 32px;
  }
  &__link {
    display: flex;
    column-gap: 2rem;
    border-radius: 8px;
    padding: 1.1rem 2rem;
    transition: all 0.3s;
    &:hover {
      background-color: $colorCorporateMain;
      .card {
        &__title,
        &__date,
        &__tags {
          color: $colorDarkWhite;
        }
        &__emoji {
          // border: 2px solid $colorDarkWhite;
          border-radius: 8px;
          font-size: 40px;
        }
      }
    }
  }
  &__emoji {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    transition: 0.3s;
  }
  &__info {
    display: flex;
    flex-direction: column;
    width: calc(100% - 100px);
  }
  &__title {
    font-size: 1.8rem;
    letter-spacing: 0.08em;
    color: $colorCorporateMain;
    font-weight: bold;
  }
  &__detail {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    column-gap: 40px;
  }
  &__date {
    font-family: $enFont;
  }
  &__tags {
    display: flex;
    column-gap: 16px;
  }
}
</style>
