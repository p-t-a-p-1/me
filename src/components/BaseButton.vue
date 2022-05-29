<template>
  <button
    :type="type"
    class="button"
    :disabled="disabled"
    @click="$emit('clickButton')"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button',
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    label: {
      type: String,
      default: '',
      required: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.button {
}
</style>
