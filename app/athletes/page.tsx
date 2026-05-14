import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity'
import { athletesListQuery, athletesByDisciplineQuery } from '@/lib/queries'
import type { Athlete } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import AthleteCard from '@/components/ui/AthleteCard'
import CategoryFilter from '@/components/ui/CategoryFilter'
import WorldAquaticsAthletes from '@/components/ui/WorldAquaticsAthletes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Athletes',
  description: 'Meet the Cook Islands aquatics athletes representing us on the world stage.',
}

const DISCIPLINES = ['Swimming', 'Open Water']

interface PageProps {
  searchParams: { discipline?: string }
}

export default async function AthletesPage({ searchParams }: PageProps) {
  const discipline = searchParams?.discipline

  const athletes = await sanityFetch<Athlete[]>({
    query: discipline ? athletesByDisciplineQuery : athletesListQuery,
    params: discipline ? { discipline } : {},
  })

  const hasSanityAthletes = athletes && athletes.length > 0

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Our Athletes"
          subtitle="Cook Islands swimmers and open water athletes competing at national and international level."
        />

        {/* ── Sanity (featured / detailed profiles) ── */}
        {hasSanityAthletes && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy">Featured Profiles</h2>
              <div className="h-0.5 flex-1 bg-gray-100" />
              <Suspense>
                <CategoryFilter
                  categories={DISCIPLINES}
                  paramName="discipline"
                  allLabel="All Disciplines"
                />
              </Suspense>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {athletes.map((athlete) => (
                <AthleteCard key={athlete._id} athlete={athlete} />
              ))}
            </div>
          </section>
        )}

        {/* ── World Aquatics registered COK athletes ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy">
              World Aquatics Registered Athletes
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            All Cook Islands athletes registered with World Aquatics · photos and profiles link to worldaquatics.com
          </p>
          <WorldAquaticsAthletes />
        </section>
      </div>
    </div>
  )
}
