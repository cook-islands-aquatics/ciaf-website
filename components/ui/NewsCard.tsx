import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { News } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  General:     'bg-gray-100 text-gray-700',
  Competition: 'bg-ciaf-sky/20 text-ciaf-blue',
  Development: 'bg-green-100 text-green-700',
  Governance:  'bg-amber-100 text-amber-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

interface NewsCardProps {
  article: News
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const imgSrc = article.coverImage
    ? urlFor(article.coverImage).width(featured ? 1000 : 600).height(400).url()
    : null
  const colorClass = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.General

  return (
    <Link href={`/news/${article.slug}`} className="group block h-full">
      <article className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden bg-ciaf-light ${featured ? 'h-64 sm:h-80' : 'h-48'}`}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={article.coverImage?.alt ?? article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? '(max-width:768px) 100vw, 66vw' : '(max-width:768px) 100vw, 33vw'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-barlow-condensed font-extrabold text-6xl text-ciaf-blue/20">CIAF</span>
            </div>
          )}
          <span className={`absolute top-3 left-3 category-badge ${colorClass}`}>
            {article.category}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs text-gray-400 font-medium mb-2">{formatDate(article.publishedAt)}</p>
          <h3 className={`font-barlow-condensed font-extrabold text-ciaf-navy group-hover:text-ciaf-blue transition-colors leading-tight ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
              {article.excerpt}
            </p>
          )}
          <span className="mt-4 text-xs font-bold text-ciaf-blue uppercase tracking-wide group-hover:text-ciaf-navy transition-colors">
            Read More →
          </span>
        </div>
      </article>
    </Link>
  )
}
