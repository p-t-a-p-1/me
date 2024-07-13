import { getArticleBySlug, getArticles } from '@/lib/newt'
import styles from '@/app/page.module.css'

type Props = {
  params: {
    slug: string
  }
}

// ビルド時に静的にルートを生成
export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}
// generateStaticParamsで定義されていないパスにアクセスされた場合、404を返す
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { slug } = params
  const article = await getArticleBySlug(slug)

  return {
    title: article?.title,
    description: '投稿詳細ページです',
  }
}

export default async function Article({ params }: Props) {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return <div>記事が見つかりません</div>
  }

  return (
    <main className={styles.main}>
      <h1>{article.title}</h1>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: article.body }} />
    </main>
  )
}
