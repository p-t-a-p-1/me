<template>
  <div>
    <transition name="fade-fast" mode="out-in">
      <component
        :is="formView"
        :form-value="currentValue"
        @confirm="formView = 'ContactConfirm'"
        @back="formView = 'ContactForm'"
        @submit="submit"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContactPage',
  data() {
    return {
      formView: 'ContactForm',
      currentValue: {
        name: '',
        email: '',
        message: '',
      },
    }
  },
  methods: {
    submit() {
      // 送信処理
      this.formView = 'ContactSubmit'
    },
  },
})
</script>
