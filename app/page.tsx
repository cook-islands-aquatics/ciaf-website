import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import {
  siteSettingsQuery,
  latestNewsQuery,
  featuredAthletesQuery,
  recentResultsQuery,
  upcomingEventsQuery,
} from '@/lib/queries'
import type { SiteSettings, News, Athlete, Result, CIAFEvent } from '@/lib/types'
import HeroSection from '@/components/ui/HeroSection'
import StatsBar from '@/components/ui/StatsBar'
import NewsCard from '@/components/ui/NewsCard'
import AthleteCard from '@/components/ui/AthleteCard'
import ResultsTable from '@/components/ui/ResultsTable'
import EventItem from '@/components/ui/EventItem'
import WorldAquaticsEvents from '@/components/ui/WorldAquaticsEvents'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Cook Islands Aquatics Federation',
  description: 'Official website of the Cook Islands Aquatics Federation — Swimming and Open Water.',
}

export default async function HomePage() {
  const now = new Date().toISOString().split('T')[0]

  const [settingsRaw, news, athletes, results, events] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery }),
    sanityFetch<News[]>({ query: latestNewsQuery }),
    sanityFetch<Athlete[]>({ query: featuredAthletesQuery }),
    sanityFetch<Result[]>({ query: recentResultsQuery }),
    sanityFetch<CIAFEvent[]>({ query: upcomingEventsQuery, params: { now } }),
  ])

  const settings: SiteSettings = settingsRaw ?? {}
  const [featured, ...rest] = news ?? []

  return (
    <>
      {/* Hero */}
      <HeroSection
        image={settings?.heroImage}
        title={settings?.heroTitle ?? 'Cook Islands Aquatics Federation'}
        subtitle={settings?.heroSubtitle}
        cta1={{ text: 'Meet the Athletes', href: '/athletes' }}
        cta2={{ text: 'View Results', href: '/results' }}
      />

      {/* Stats bar */}
      <StatsBar stats={settings.stats} />

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-barlow-condensed font-extrabold text-4xl text-ciaf-navy">Latest News</h2>
              <div className="mt-2 h-1 w-12 bg-ciaf-sky rounded" />
            </div>
            <Link
              href="/news"
              className="text-sm font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors"
            >
              All News →
            </Link>
          </div>

          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured && (
                <div className="md:col-span-2">
                  <NewsCard article={featured} featured />
                </div>
              )}
              <div className="flex flex-col gap-6">
                {rest.map((article) => (
                  <NewsCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">News coming soon.</p>
          )}
        </div>
      </section>

      {/* Featured Athletes */}
      <section className="py-16 bg-ciaf-light">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-barlow-condensed font-extrabold text-4xl text-ciaf-navy">Featured Athletes</h2>
              <div className="mt-2 h-1 w-12 bg-ciaf-sky rounded" />
            </div>
            <Link
              href="/athletes"
              className="text-sm font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors"
            >
              All Athletes →
            </Link>
          </div>

          {athletes && athletes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {athletes.map((athlete) => (
                <AthleteCard key={athlete._id} athlete={athlete} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">Athlete profiles coming soon.</p>
          )}
        </div>
      </section>

      {/* Results Snapshot + Upcoming Events — two columns */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Results */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-barlow-condensed font-extrabold text-3xl text-ciaf-navy">Recent Results</h2>
                  <div className="mt-2 h-1 w-12 bg-ciaf-sky rounded" />
                </div>
                <Link href="/results" className="text-sm font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors">
                  All Results →
                </Link>
              </div>
              {results && results.length > 0 ? (
                <ResultsTable results={results} compact />
              ) : (
                <p className="text-gray-400 text-center py-10 bg-gray-50 rounded-lg">No results yet.</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-barlow-condensed font-extrabold text-3xl text-ciaf-navy">Upcoming Events</h2>
                  <div className="mt-2 h-1 w-12 bg-ciaf-sky rounded" />
                </div>
                <Link href="/events" className="text-sm font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors">
                  All Events →
                </Link>
              </div>
              {events && events.length > 0 ? (
                <div className="flex flex-col gap-4 mb-6">
                  {events.map((event) => (
                    <EventItem key={event._id} event={event} />
                  ))}
                </div>
              ) : null}
              {/* World Aquatics live calendar — always shown */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">World Aquatics Calendar</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
                <WorldAquaticsEvents />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-ciaf-blue py-14">
        <div className="container-wide text-center">
          <h2 className="font-barlow-condensed font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Join the CIAF Community
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Whether you&apos;re a swimmer, coach, or fan — get involved with Cook Islands aquatics.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-ciaf-sky text-ciaf-navy px-8 py-4 rounded font-bold text-sm uppercase tracking-wide hover:bg-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
