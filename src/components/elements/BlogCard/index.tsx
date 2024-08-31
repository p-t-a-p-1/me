import Link from 'next/link'

export default function BlogCard({
  emoji,
  url,
  title,
  description,
}: {
  emoji: string
  url: string
  title: string
  description?: string
}) {
  return (
    <article className="flex flex-col rounded-lg border border-gray-100 bg-background hover:bg-accent p-4 shadow-sm transition hover:shadow-lg sm:p-6">
      <div className="inline-flex rounded p-2 border border-gray-100 w-fit">{emoji}</div>

      <Link href={url}>
        <h3 className="mt-0.5 text-lg font-medium text-secondary-foreground">{title}</h3>
      </Link>

      <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">{description}</p>

      <Link
        href={url}
        className="group mt-auto inline-flex items-center gap-1 text-sm font-medium text-blue-600"
      >
        More
        <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
          &rarr;
        </span>
      </Link>
    </article>
  )
}
