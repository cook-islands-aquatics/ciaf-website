import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity'
import { newsListQuery, newsByCategoryQuery } from '@/lib/queries'
import type { News } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import NewsCard from '@/components/ui/NewsCard'
import CategoryFilter from '@/components/ui/CategoryFilter'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from the Cook Islands Aquatics Federation.',
}

const NEWS_CATEGORIES = ['General', 'Competition', 'Development', 'Governance']

interface PageProps {
  searchParams: { category?: string }
}

export default async function NewsPage({ searchParams }: PageProps) {
  const category = searchParams?.category

  const news = await sanityFetch<News[]>({
    query: category ? newsByCategoryQuery : newsListQuery,
    params: category ? { category } : {},
  })

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Latest News"
          subtitle="Stay up to date with competition results, federation updates, and development news."
        />

        {/* Filter */}
        <div className="mb-8">
          <Suspense>
            <CategoryFilter categories={NEWS_CATEGORIES} paramName="category" />
          </Suspense>
        </div>

        {/* Grid */}
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No articles found{category ? ` in "${category}"` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
