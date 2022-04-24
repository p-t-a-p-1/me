import { Inject, NuxtApp } from '@nuxt/types/app'

import { apiRepositoryFactory, Repositories } from '../api/factories/api'

export default ({ app }: { app: NuxtApp }, inject: Inject) => {
  const repositories = (name: keyof Repositories) => {
    return apiRepositoryFactory.get(name)(app)
  }

  inject('repositories', repositories)
}
