import Vue from 'vue'
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
  setInteractionMode,
} from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'

/**
 * 必要なルールのみインポート
 */
// 必須
extend('required', {
  ...required,
  message: '必須項目です',
})
// emailアドレス
extend('email', {
  ...email,
  message: '有効なメールアドレスではありません',
})

// メッセージを設定
localize('ja', ja)

// フォーカスアウト時にバリデーションチェック
setInteractionMode('eager')

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
