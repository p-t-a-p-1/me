import BlogCard from '@/components/elements/BlogCard'
// import { Button } from '@/components/ui/button'
import { getArticles } from '@/lib/newt'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newt/Next.jsブログ',
  description: 'Newt/Next.jsを利用したブログです',
}

export default async function Home() {
  const articles = await getArticles()

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-bold">記事一覧</h1>
      {/* <Button>ボタン</Button> */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4">
        {articles.map((article) => {
          const hasUrl = !!article.url
          const url = hasUrl ? article.url : `articles/${article.slug}`
          return (
            <BlogCard
              key={article._id}
              emoji={article.emoji.value}
              url={url}
              title={article.title}
            />
          )
        })}
      </div>
    </section>
  )
}
