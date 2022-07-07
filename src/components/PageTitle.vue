<template>
  <h1 class="title">
    {{ label }}
  </h1>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    label: {
      type: String,
      default: '',
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  padding: 80px 0;
  font-size: 4rem;
  color: $colorCorporateMain;
  font-family: $enFont;
  font-weight: bold;
  letter-spacing: 0.08em;
  @media #{$sp} {
    padding: 16px 0 8px;
  }
}
</style>
