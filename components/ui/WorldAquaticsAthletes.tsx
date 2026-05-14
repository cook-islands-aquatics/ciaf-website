'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { WAAthleteWithPhoto } from '@/app/api/world-aquatics/athletes/route'

const DISCIPLINE_LABEL: Record<string, string> = {
  SW: 'Swimming',
  OW: 'Open Water',
}

const GENDER_LABEL: Record<string, string> = {
  M: 'Male',
  F: 'Female',
}

function formatDOB(dob: string) {
  return new Date(dob).toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function AthleteCard({ athlete }: { athlete: WAAthleteWithPhoto }) {
  const imgSrc = athlete.photo
    ? `${athlete.photo.onDemandUrl}?width=400&height=500`
    : null

  const disciplines = athlete.disciplines
    .filter((d) => DISCIPLINE_LABEL[d])
    .map((d) => DISCIPLINE_LABEL[d])

  return (
    <Link
      href={athlete.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
        {/* Photo */}
        <div className="relative h-60 bg-ciaf-light overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={athlete.fullName}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:768px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ciaf-light to-ciaf-sky/20">
              <svg viewBox="0 0 64 64" className="w-24 h-24 text-ciaf-blue/20" fill="currentColor">
                <circle cx="32" cy="22" r="12" />
                <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24H8z" />
              </svg>
            </div>
          )}
          {/* Gender pill */}
          <span className="absolute top-2 right-2 discipline-pill bg-white/80 text-ciaf-navy text-[10px] backdrop-blur-sm">
            {GENDER_LABEL[athlete.gender] ?? athlete.gender}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-barlow-condensed font-extrabold text-xl text-ciaf-navy group-hover:text-ciaf-blue transition-colors leading-tight">
            {athlete.firstName}{' '}
            <span className="uppercase">{athlete.lastName}</span>
          </h3>

          <div className="mt-1.5 flex flex-wrap gap-1">
            {disciplines.map((d) => (
              <span key={d} className="discipline-pill bg-ciaf-sky/20 text-ciaf-blue">
                {d}
              </span>
            ))}
          </div>

          {athlete.dateOfBirth && (
            <p className="mt-2 text-xs text-gray-400">
              b. {formatDOB(athlete.dateOfBirth)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-60 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function WorldAquaticsAthletes() {
  const [athletes, setAthletes] = useState<WAAthleteWithPhoto[] | null>(null)
  const [error, setError] = useState(false)
  const [discipline, setDiscipline] = useState<'All' | 'SW' | 'OW'>('All')
  const [gender, setGender] = useState<'All' | 'M' | 'F'>('All')

  useEffect(() => {
    fetch('/api/world-aquatics/athletes')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then(setAthletes)
      .catch(() => setError(true))
  }, [])

  if (error) return (
    <p className="text-sm text-gray-400 text-center py-10">
      Could not load World Aquatics athlete data.
    </p>
  )

  const filtered = athletes?.filter((a) => {
    if (discipline !== 'All' && !a.disciplines.includes(discipline)) return false
    if (gender !== 'All' && a.gender !== gender) return false
    return true
  })

  const filterBtn = (
    active: boolean,
    label: string,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        active
          ? 'bg-ciaf-navy text-white'
          : 'bg-white text-ciaf-navy border border-gray-200 hover:border-ciaf-navy'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-1.5">
          {filterBtn(discipline === 'All', 'All Disciplines', () => setDiscipline('All'))}
          {filterBtn(discipline === 'SW', 'Swimming', () => setDiscipline('SW'))}
          {filterBtn(discipline === 'OW', 'Open Water', () => setDiscipline('OW'))}
        </div>
        <div className="flex gap-1.5">
          {filterBtn(gender === 'All', 'All', () => setGender('All'))}
          {filterBtn(gender === 'M', 'Men', () => setGender('M'))}
          {filterBtn(gender === 'F', 'Women', () => setGender('F'))}
        </div>
      </div>

      {/* Grid */}
      {!athletes ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered!.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No athletes match this filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered!.map((a) => <AthleteCard key={a.id} athlete={a} />)}
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400 text-center">
        {athletes ? `${filtered!.length} of ${athletes.length} Cook Islands registered athletes · ` : ''}
        Data from{' '}
        <a href="https://www.worldaquatics.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
          World Aquatics
        </a>
        {' '}· updated hourly
      </p>
    </div>
  )
}
