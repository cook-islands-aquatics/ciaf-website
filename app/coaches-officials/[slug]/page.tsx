import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { coachOfficialQuery, coachOfficialSlugsQuery } from '@/lib/queries'
import type { CoachOfficial } from '@/lib/types'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

const ROLE_COLORS: Record<string, string> = {
  Coach:    'bg-ciaf-sky/20 text-ciaf-blue',
  Official: 'bg-amber-100 text-amber-700',
  Both:     'bg-ciaf-light text-ciaf-navy',
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({ query: coachOfficialSlugsQuery, revalidate: 3600 })
  return slugs?.map((s) => ({ slug: s.slug })) ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const person = await sanityFetch<CoachOfficial>({ query: coachOfficialQuery, params: { slug: params.slug } })
  if (!person) return {}
  const ogImage = person.photo
    ? urlFor(person.photo).width(1200).height(630).url()
    : '/hero.jpg'
  return {
    title: person.name,
    description: `${person.name} — Cook Islands Aquatics ${person.role}.`,
    openGraph: {
      title: `${person.name} | CIAF`,
      description: `${person.name} — Cook Islands Aquatics ${person.role}.`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

export default async function CoachOfficialDetailPage({ params }: PageProps) {
  const person = await sanityFetch<CoachOfficial>({
    query: coachOfficialQuery,
    params: { slug: params.slug },
  })

  if (!person) notFound()

  const imgSrc = person.photo ? urlFor(person.photo).width(600).height(700).url() : null
  const roleClass = ROLE_COLORS[person.role] ?? ROLE_COLORS.Coach

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        {/* Back link */}
        <Link
          href="/coaches-officials"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ciaf-blue transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Coaches &amp; Officials
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Photo + meta */}
          <div className="lg:col-span-1">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-ciaf-light shadow-lg mb-6">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={person.name}
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
                <span className="text-gray-500">Role</span>
                <span className={`discipline-pill ${roleClass}`}>{person.role}</span>
              </div>
              {person.accreditationLevel && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Accreditation</span>
                  <span className="font-medium text-ciaf-navy text-right">{person.accreditationLevel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — Bio */}
          <div className="lg:col-span-2">
            <h1 className="font-barlow-condensed font-extrabold text-5xl text-ciaf-navy leading-tight mb-2">
              {person.name}
            </h1>
            <div className="h-1 w-16 bg-ciaf-sky rounded mb-6" />

            {person.bio && person.bio.length > 0 ? (
              <section>
                <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Biography</h2>
                <PortableTextRenderer value={person.bio} />
              </section>
            ) : (
              <p className="text-gray-400 italic">No biography available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
