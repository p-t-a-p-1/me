<template>
  <div>
    <page-title label="HOME" />
    <!-- news -->
    <section class="-item section">
      <div class="section__head">
        <!-- <h2 class="section__title">
          About
        </h2> -->
      </div>
      <div class="section__main">
        <dl class="profile">
          <div>
            <dt>Place</dt>
            <dd>北海道札幌市</dd>
          </div>
          <div>
            <dt>Job</dt>
            <dd>フロントエンドエンジニア</dd>
          </div>
          <div>
            <dt>Like</dt>
            <dd>Vue.js/NuxtJSを利用したWebサイト制作やWebサービス開発</dd>
          </div>
        </dl>
      </div>
    </section>
    <!-- about -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  head() {
    return {
      titleTemplate: '',
      title: 'ptap1',
    }
  },
})
</script>

<style lang="scss" scoped>
.section {
  &__head {
    display: flex;
    column-gap: 16px;
    align-items: center;
  }
  &__title {
    font-size: 3.2rem;
    font-weight: bold;
    letter-spacing: 0.08em;
    color: $colorCorporateMain;
  }
  &__link {
    margin-top: 32px;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }
  &__main {
    // margin-top: 16px;
  }
  &__description {
  }
}
.-item {
  & + & {
    margin-top: 64px;
  }
}
.profile {
  // margin-top: 32px;
  & > div {
    display: flex;
    padding: 16px 0;
    @media #{$sp} {
      flex-direction: column;
    }
  }
  dt {
    font-family: $enFont;
    letter-spacing: 0.08em;
    font-size: 1.8rem;
    color: $colorCorporateMain;
    font-weight: bold;
    @media #{$pc} {
      width: 20%;
    }
  }
  dd {
    @media #{$pc} {
      width: 80%;
    }
  }
}
</style>
