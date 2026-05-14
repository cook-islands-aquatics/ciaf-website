import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Athlete } from '@/lib/types'

const DISCIPLINE_COLORS: Record<string, string> = {
  Swimming:    'bg-ciaf-sky/20 text-ciaf-blue',
  'Open Water': 'bg-blue-100 text-blue-700',
  Both:        'bg-ciaf-light text-ciaf-navy',
}

interface AthleteCardProps {
  athlete: Athlete
}

export default function AthleteCard({ athlete }: AthleteCardProps) {
  const imgSrc = athlete.photo
    ? urlFor(athlete.photo).width(400).height(400).url()
    : null
  const disciplineClass = DISCIPLINE_COLORS[athlete.discipline] ?? DISCIPLINE_COLORS.Swimming

  return (
    <Link href={`/athletes/${athlete.slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        {/* Photo */}
        <div className="relative h-60 bg-ciaf-light overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={athlete.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ciaf-light to-ciaf-sky/20">
              {/* SVG avatar placeholder */}
              <svg viewBox="0 0 64 64" className="w-24 h-24 text-ciaf-blue/30" fill="currentColor">
                <circle cx="32" cy="22" r="12" />
                <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24H8z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-barlow-condensed font-extrabold text-xl text-ciaf-navy group-hover:text-ciaf-blue transition-colors leading-tight">
            {athlete.name}
          </h3>
          <span className={`inline-block mt-1.5 discipline-pill ${disciplineClass}`}>
            {athlete.discipline}
          </span>
          {athlete.achievements && athlete.achievements.length > 0 && (
            <p className="mt-2.5 text-xs text-gray-500 font-medium">
              🏅 {athlete.achievements[0]}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
