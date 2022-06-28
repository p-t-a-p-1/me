import { NuxtAppOptions } from '@nuxt/types'
// eslint-disable-next-line import/named
import { NavigationGuardNext, Route } from 'vue-router'
import { gsap } from 'gsap'

// ページ遷移時にアニメーションを実行
export default ({ app }: NuxtAppOptions) => {
  app.router.beforeEach(
    async (to: Route, from: Route, next: NavigationGuardNext) => {
      // 初回読み込み時に画面遷移アニメーションは出さないようにする
      // ブラウザ時のみ
      // ページ遷移中でない場合（extendRoutesのパスだと2回カーテンが表示されてしまうため）
      // 初回アクセス以外
      // toとfromが存在する（直アクセス以外）
      const hasFromTo = !!to.name && !!from.name

      if (process.client && hasFromTo) {
        // store.dispatch('setIsPageChanging', true)
        // 画面遷移アニメーション
        await startTransition(next)
      } else {
        await next()
      }
    }
  )

  app.router.afterEach(async (to: Route, from: Route) => {
    const hasFromTo = !!to.name && !!from.name

    if (process.client && hasFromTo) {
      await endTransition()
    }
  })
}

/**
 * 画面遷移開始前のカーテンが入っていくアニメーション
 */
const startTransition = (next: NavigationGuardNext) => {
  const tl = gsap.timeline()
  tl.set('.curtain_enter', {
    top: '-100vh',
    opacity: 1,
  }).to('.curtain_enter', {
    duration: 0.3,
    top: 0,
    ease: 'Power3.inOut',
    stagger: {
      ease: 'Power3.inOut',
      from: 'start',
      amount: 0.3,
    },
    onComplete() {
      // 遷移後のページへ
      next()
    },
  })
}
/**
 * 画面遷移後のカーテンが出ていくアニメーション
 */
const endTransition = () => {
  const tl = gsap.timeline()
  tl.to(
    '.curtain_enter_1',
    {
      opacity: 0,
      delay: 0,
    },
    '+=0.3'
  ).to('.curtain_enter', {
    duration: 0.3,
    top: '100vh',
    ease: 'Power3.inOut',
    stagger: {
      ease: 'Power3.inOut',
      from: 'end',
      amount: 0.3,
    },
  })
}
