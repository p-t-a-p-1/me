<template>
  <div>
    <ValidationObserver ref="obs" v-slot="{ handleSubmit, invalid }">
      <form @submit.prevent="handleSubmit(confirm)">
        <div>
          <label for="name">お名前</label>
          <ValidationProvider v-slot="{ errors }" rules="required" name="name">
            <input
              id="name"
              type="text"
              name="name"
              :value="formValue.name"
              @input="editValue.name = $event.target.value"
            />
            <div class="error">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>
        <div>
          <label for="email">メールアドレス</label>
          <ValidationProvider v-slot="{ errors }" rules="required" name="email">
            <input
              id="email"
              type="text"
              name="email"
              :value="formValue.email"
              @input="editValue.email = $event.target.value"
            />
            <div class="error">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>
        <div>
          <label for="message">本文</label>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            name="message"
          >
            <textarea
              id="message"
              type="text"
              name="message"
              :value="formValue.message"
              @input="editValue.message = $event.target.value"
            />
            <div class="error">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>

        <base-button type="submit" :disabled="invalid" label="次へ" />
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContactForm',
  props: {
    formValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editValue: this.formValue,
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.editValue)
    },
  },
})
</script>
