import { NuxtApp, Context } from '@nuxt/types/app'
import { createClient } from 'newt-client-js'

// Newtのクライアントインスタンス生成
const createNewtClient = (config: Context['$config']) => {
  return createClient({
    spaceUid: config.spaceUid,
    token: config.token,
    apiType: config.apiType,
  })
}

export const BlogRepository = (app: NuxtApp) => ({
  findList() {
    const client = createNewtClient(app.$config)
    const response = client.getContents({
      appUid: 'meBlog',
      modelUid: 'article',
      query: {},
    })
    return response
  },

  findOne(postSlug: string) {
    const client = createNewtClient(app.$config)
    const response = client.getContents({
      appUid: 'meBlog',
      modelUid: 'article',
      query: {
        depth: 1,
        limit: 1,
        slug: postSlug,
      },
    })
    return response
  },
})
