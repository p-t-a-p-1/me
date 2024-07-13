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
    <main>
      <h1 className="text-2xl font-bold underline">記事一覧</h1>
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
    </main>
  )
}
