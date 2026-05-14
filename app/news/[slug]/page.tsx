import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity'
import { newsArticleQuery, newsSlugsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { News } from '@/lib/types'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

const CATEGORY_COLORS: Record<string, string> = {
  General:     'bg-gray-100 text-gray-700',
  Competition: 'bg-ciaf-sky/20 text-ciaf-blue',
  Development: 'bg-green-100 text-green-700',
  Governance:  'bg-amber-100 text-amber-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NZ', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({ query: newsSlugsQuery, revalidate: 3600 })
  return slugs?.map((s) => ({ slug: s.slug })) ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await sanityFetch<News>({ query: newsArticleQuery, params: { slug: params.slug } })
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage
        ? [{ url: urlFor(article.coverImage).width(1200).height(630).url() }]
        : [],
    },
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const article = await sanityFetch<News>({
    query: newsArticleQuery,
    params: { slug: params.slug },
  })

  if (!article) notFound()

  const imgSrc = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(500).url()
    : null

  const colorClass = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.General

  return (
    <article>
      {/* Cover image hero */}
      {imgSrc && (
        <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-ciaf-light">
          <Image
            src={imgSrc}
            alt={article.coverImage?.alt ?? article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="container-wide py-12 max-w-3xl">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`category-badge ${colorClass}`}>{article.category}</span>
          <span className="text-sm text-gray-400">{formatDate(article.publishedAt)}</span>
          {article.author && (
            <span className="text-sm text-gray-400">by {article.author}</span>
          )}
        </div>

        <h1 className="font-barlow-condensed font-extrabold text-4xl sm:text-5xl text-ciaf-navy leading-tight mb-6">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed mb-8 border-l-4 border-ciaf-sky pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Body */}
        {article.body && article.body.length > 0 ? (
          <div className="prose-custom">
            <PortableTextRenderer value={article.body} />
          </div>
        ) : (
          <p className="text-gray-400">Full article content coming soon.</p>
        )}
      </div>
    </article>
  )
}
