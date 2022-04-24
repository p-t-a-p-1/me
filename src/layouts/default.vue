<template>
  <div class="wrapper">
    <layout-header class="wrapper__header" />
    <main class="wrapper__main">
      <Nuxt />
    </main>
    <layout-footer class="wrapper__footer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutDefault',
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: auto;
  }
  &__main {
    margin: 104px auto 0;
    width: 100%;
    max-width: 1000px;
    padding: 0 40px;
    flex: 1 0 auto;
    @media #{$sp} {
      padding: 0px 4.3%;
    }
  }
  &__footer {
    margin-top: 40px;
  }
}
</style>
