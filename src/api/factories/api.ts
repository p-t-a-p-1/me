import { BlogRepository } from '../repositories/blog'

export interface Repositories {
  blog: typeof BlogRepository
}

const repositories: Repositories = {
  blog: BlogRepository,
}

export const apiRepositoryFactory = {
  get(key: keyof Repositories) {
    return repositories[key]
  },
}
