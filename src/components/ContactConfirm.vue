<template>
  <div>
    <div class="confirmWrap_main confirmMain">
      <pre>{{ formValue }}</pre>
      <!-- <confirm-item
        :label-text="'Name'"
        :value="formValue.name"
        class="confirmMain_item"
      /> -->
      <!-- <confirm-item
        :label-text="'メールアドレス'"
        :value="formValue.email"
        class="confirmMain_item"
      />
      <confirm-item
        :label-text="'お問い合わせ内容'"
        :value="formValue.message"
        class="confirmMain_item"
      /> -->
    </div>
    <div class="confirmWrap_submit">
      <base-button label="送信する" @clickButton="$emit('submit')" />
    </div>
    <div class="confirmWrap_back">
      <button type="button" class="-button" @click="$emit('back')">
        入力画面に戻る
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContactConfirm',
  props: {
    formValue: {
      type: Object,
      required: true,
    },
  },
})
</script>
