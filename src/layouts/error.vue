<template>
  <div class="error">
    <page-title label="404" class="error__title" />
    <p class="error__description">お探しのページは見つかりませんでした。</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ErrorPage',
})
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  flex-direction: column;
  &__title {
  }
}
</style>
