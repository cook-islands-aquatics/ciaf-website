import type { Metadata } from 'next'
import { Suspense } from 'react'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { coachesOfficialsListQuery, coachesByRoleQuery } from '@/lib/queries'
import type { CoachOfficial } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import CategoryFilter from '@/components/ui/CategoryFilter'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Coaches & Officials',
  description: 'Meet the coaches and officials serving Cook Islands aquatics.',
}

interface PageProps {
  searchParams: { role?: string }
}

const ROLE_COLORS: Record<string, string> = {
  Coach:    'bg-ciaf-sky/20 text-ciaf-blue',
  Official: 'bg-amber-100 text-amber-700',
  Both:     'bg-ciaf-light text-ciaf-navy',
}

function PersonCard({ person }: { person: CoachOfficial }) {
  const imgSrc = person.photo ? urlFor(person.photo).width(400).height(400).url() : null
  const roleClass = ROLE_COLORS[person.role] ?? ROLE_COLORS.Coach

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-52 bg-ciaf-light overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={person.name}
            fill
            className="object-cover object-top"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ciaf-light to-ciaf-sky/10">
            <svg viewBox="0 0 64 64" className="w-20 h-20 text-ciaf-blue/20" fill="currentColor">
              <circle cx="32" cy="22" r="12" />
              <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24H8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-barlow-condensed font-extrabold text-xl text-ciaf-navy leading-tight">
          {person.name}
        </h3>
        <span className={`inline-block mt-1.5 discipline-pill ${roleClass}`}>{person.role}</span>
        {person.accreditationLevel && (
          <p className="mt-2 text-xs text-gray-500">{person.accreditationLevel}</p>
        )}
        {person.bio && person.bio.length > 0 && (
          <div className="mt-3 text-sm text-gray-600 line-clamp-3">
            <PortableTextRenderer value={person.bio} />
          </div>
        )}
      </div>
    </div>
  )
}

export default async function CoachesOfficialsPage({ searchParams }: PageProps) {
  const role = searchParams?.role

  const people = await sanityFetch<CoachOfficial[]>({
    query: role ? coachesByRoleQuery : coachesOfficialsListQuery,
    params: role ? { role } : {},
  })

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Coaches & Officials"
          subtitle="The dedicated coaches and officials who develop and support Cook Islands aquatics."
        />

        <div className="mb-8">
          <Suspense>
            <CategoryFilter
              categories={['Coach', 'Official']}
              paramName="role"
              allLabel="All Roles"
            />
          </Suspense>
        </div>

        {people && people.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {people.map((person) => (
              <PersonCard key={person._id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">
              No{role ? ` "${role}"` : ''} profiles found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
