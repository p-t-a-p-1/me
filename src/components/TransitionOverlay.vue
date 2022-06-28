<template>
  <div class="curtain">
    <div class="">
      <div class="curtain_enter curtain_enter_1" />
      <div class="curtain_enter curtain_enter_2" />
      <div class="curtain_enter curtain_enter_3" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransitionOverlay',
}
</script>

<style lang="scss" scoped>
.curtain {
  &_enter {
    position: fixed;
    top: -100vh;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    overflow: hidden;
    &_1 {
      background-color: rgba($color: $colorCorporateMain, $alpha: 0.3);
      z-index: 9990;
    }
    &_2 {
      background-color: rgba($color: $colorCorporateMain, $alpha: 0.5);
      z-index: 9990;
    }
    &_3 {
      background-color: rgba($color: $colorCorporateMain, $alpha: 1);
      z-index: 9990;
    }
  }
}
</style>
