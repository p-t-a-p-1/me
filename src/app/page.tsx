import { Button } from '@/components/ui/button'
import { getArticles } from '@/lib/newt'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newt/Next.jsブログ',
  description: 'Newt/Next.jsを利用したブログです',
}

export default async function Home() {
  const articles = await getArticles()

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-bold">記事一覧</h1>
      <Button>ボタン</Button>
      <ul>
        {articles.map((article) => {
          const hasUrl = !!article.url
          const url = hasUrl ? article.url : `articles/${article.slug}`
          return (
            <li key={article._id}>
              <Link href={url} target={hasUrl ? '_blank' : ''}>
                {article.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
