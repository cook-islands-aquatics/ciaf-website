import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity'
import { resultsListQuery, resultsByYearQuery, resultsByDisciplineQuery } from '@/lib/queries'
import type { Result } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import ResultsTable from '@/components/ui/ResultsTable'
import CategoryFilter from '@/components/ui/CategoryFilter'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Results',
  description: 'Competition results for Cook Islands aquatics athletes.',
}

interface PageProps {
  searchParams: { discipline?: string; year?: string }
}

function getYears(results: Result[]): string[] {
  const years = results.map((r) => r.meetDate.split('-')[0])
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const { discipline, year } = searchParams ?? {}

  let results: Result[]

  if (discipline) {
    results = await sanityFetch<Result[]>({ query: resultsByDisciplineQuery, params: { discipline } })
  } else if (year) {
    results = await sanityFetch<Result[]>({
      query: resultsByYearQuery,
      params: { yearStart: `${year}-01-01`, yearEnd: `${year}-12-31` },
    })
  } else {
    results = await sanityFetch<Result[]>({ query: resultsListQuery })
  }

  results = results ?? []

  // Get all years for the year filter (from unfiltered results)
  const allResults = discipline || year
    ? await sanityFetch<Result[]>({ query: resultsListQuery })
    : results
  const years = getYears(allResults ?? [])

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Results"
          subtitle="Competition results for CIAF athletes across swimming and open water events."
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Discipline</p>
            <Suspense>
              <CategoryFilter
                categories={['Swimming', 'Open Water']}
                paramName="discipline"
                allLabel="All Disciplines"
              />
            </Suspense>
          </div>
          {years.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Year</p>
              <Suspense>
                <CategoryFilter
                  categories={years}
                  paramName="year"
                  allLabel="All Years"
                />
              </Suspense>
            </div>
          )}
        </div>

        <ResultsTable results={results} />
      </div>
    </div>
  )
}
