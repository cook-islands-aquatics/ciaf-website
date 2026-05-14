import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/lib/sanity'
import { allEventsQuery } from '@/lib/queries'
import type { CIAFEvent } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import EventItem from '@/components/ui/EventItem'
import CategoryFilter from '@/components/ui/CategoryFilter'
import WorldAquaticsEvents from '@/components/ui/WorldAquaticsEvents'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past aquatics events for Cook Islands athletes.',
}

interface PageProps {
  searchParams: { view?: string }
}

export default async function EventsPage({ searchParams }: PageProps) {
  const view = searchParams?.view ?? 'upcoming'
  const now = new Date().toISOString().split('T')[0]

  const allEvents = await sanityFetch<CIAFEvent[]>({ query: allEventsQuery })
  const events = allEvents ?? []

  const upcoming = events.filter((e) => e.startDate >= now)
  const past = events.filter((e) => e.startDate < now)
  const displayed = view === 'past' ? past : upcoming

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Events"
          subtitle="CIAF events and the upcoming World Aquatics international calendar."
        />

        {/* Two-column layout: CIAF events left, WA calendar right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left: CIAF events ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy">
                CIAF Events
              </h2>
              <Suspense>
                <CategoryFilter
                  categories={['Past']}
                  paramName="view"
                  allLabel="Upcoming"
                />
              </Suspense>
            </div>

            {displayed.length > 0 ? (
              <div className="flex flex-col gap-4">
                {displayed.map((event) => (
                  <EventItem key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-14 text-gray-400 bg-gray-50 rounded-xl">
                <p className="font-medium">
                  {view === 'past' ? 'No past events recorded yet.' : 'No upcoming CIAF events scheduled.'}
                </p>
                <p className="text-sm mt-1">Add events via the Studio.</p>
              </div>
            )}
          </div>

          {/* ── Right: World Aquatics live calendar ── */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy">
                World Aquatics Calendar
              </h2>
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Live" />
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Upcoming SW &amp; OW competitions from worldaquatics.com — updated hourly.
            </p>
            <WorldAquaticsEvents />
          </div>

        </div>
      </div>
    </div>
  )
}
