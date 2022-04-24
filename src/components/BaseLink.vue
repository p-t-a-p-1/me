<template>
  <nuxt-link :to="path" class="-link">
    {{ label }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'BaseLink',
  props: {
    label: {
      type: String,
      default: 'HOME',
      required: true,
    },
    path: {
      type: String,
      default: '/',
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.-link {
  display: inline-block;
  padding: 8px 16px;
  border: 2px solid $colorCorporateMain;
  background-color: $colorDarkWhite;
  color: $colorCorporateMain;
  transition: background-color 0.3s, color 0.5s;
  &:hover {
    background-color: $colorCorporateMain;
    color: $colorDarkWhite;
  }
}
</style>
