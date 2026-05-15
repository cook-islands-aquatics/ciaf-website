import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { athleteQuery, athleteSlugsQuery, resultsListQuery } from '@/lib/queries'
import type { Athlete, Result } from '@/lib/types'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

function calculateAge(dob?: string) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

const DISCIPLINE_COLORS: Record<string, string> = {
  Swimming:    'bg-ciaf-sky/20 text-ciaf-blue',
  'Open Water': 'bg-blue-100 text-blue-700',
  Both:        'bg-ciaf-light text-ciaf-navy',
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({ query: athleteSlugsQuery, revalidate: 3600 })
  return slugs?.map((s) => ({ slug: s.slug })) ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const athlete = await sanityFetch<Athlete>({ query: athleteQuery, params: { slug: params.slug } })
  if (!athlete) return {}
  const ogImage = athlete.photo
    ? urlFor(athlete.photo).width(1200).height(630).url()
    : '/hero.jpg'
  return {
    title: athlete.name,
    description: `${athlete.name} — Cook Islands ${athlete.discipline} athlete.`,
    openGraph: {
      title: `${athlete.name} | CIAF`,
      description: `${athlete.name} — Cook Islands ${athlete.discipline} athlete.`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

export default async function AthleteDetailPage({ params }: PageProps) {
  const [athlete, allResults] = await Promise.all([
    sanityFetch<Athlete>({ query: athleteQuery, params: { slug: params.slug } }),
    sanityFetch<Result[]>({ query: resultsListQuery }),
  ])

  if (!athlete) notFound()

  const athleteResults = allResults?.filter((r) => r.athlete?.slug === params.slug) ?? []
  const imgSrc = athlete.photo ? urlFor(athlete.photo).width(600).height(700).url() : null
  const disciplineClass = DISCIPLINE_COLORS[athlete.discipline] ?? DISCIPLINE_COLORS.Swimming
  const age = calculateAge(athlete.dateOfBirth)

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Photo + meta */}
          <div className="lg:col-span-1">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-ciaf-light shadow-lg mb-6">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={athlete.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ciaf-light to-ciaf-sky/20">
                  <svg viewBox="0 0 64 64" className="w-32 h-32 text-ciaf-blue/20" fill="currentColor">
                    <circle cx="32" cy="22" r="12" />
                    <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24H8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="bg-ciaf-light rounded-xl p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Discipline</span>
                <span className={`discipline-pill ${disciplineClass}`}>{athlete.discipline}</span>
              </div>
              {athlete.dateOfBirth && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="font-medium text-ciaf-navy">{formatDate(athlete.dateOfBirth)}</span>
                </div>
              )}
              {age && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Age</span>
                  <span className="font-medium text-ciaf-navy">{age} years</span>
                </div>
              )}
              {athlete.achievements && athlete.achievements.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-2">Achievements</p>
                  <ul className="space-y-1">
                    {athlete.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-base leading-none mt-0.5">🏅</span>
                        <span className="text-ciaf-navy font-medium text-xs">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right — Bio + PBs + Results */}
          <div className="lg:col-span-2">
            <h1 className="font-barlow-condensed font-extrabold text-5xl text-ciaf-navy leading-tight mb-2">
              {athlete.name}
            </h1>
            <div className="h-1 w-16 bg-ciaf-sky rounded mb-6" />

            {/* Biography */}
            {athlete.bio && athlete.bio.length > 0 && (
              <section className="mb-10">
                <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Biography</h2>
                <PortableTextRenderer value={athlete.bio} />
              </section>
            )}

            {/* Personal Bests */}
            {athlete.personalBests && athlete.personalBests.length > 0 && (
              <section className="mb-10">
                <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Personal Bests</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-ciaf-navy text-white text-left">
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Event</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-right">Time</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs hidden md:table-cell">Meet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {athlete.personalBests.map((pb, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-4 py-3 font-medium text-ciaf-navy">{pb.event}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-ciaf-blue">{pb.time}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                            {pb.date ? formatDate(pb.date) : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{pb.meet ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Competition history */}
            {athleteResults.length > 0 && (
              <section>
                <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Competition History</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-ciaf-navy text-white text-left">
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Meet</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Event</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-right">Time</th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-center">Place</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {athleteResults.map((r, i) => (
                        <tr key={r._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate">{r.meet}</td>
                          <td className="px-4 py-3 font-medium text-ciaf-navy">{r.event}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{formatDate(r.meetDate)}</td>
                          <td className="px-4 py-3 text-right font-mono font-semibold">{r.time ?? '—'}</td>
                          <td className="px-4 py-3 text-center">
                            {r.place === 1 ? '🥇' : r.place === 2 ? '🥈' : r.place === 3 ? '🥉' : r.place ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
