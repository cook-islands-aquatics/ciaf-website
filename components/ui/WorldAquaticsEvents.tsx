'use client'

import { useEffect, useState } from 'react'
import type { WACompetition } from '@/app/api/world-aquatics/route'
import Link from 'next/link'

const DISCIPLINE_LABEL: Record<string, string> = {
  SW: 'Swimming',
  OW: 'Open Water',
  DV: 'Diving',
  WP: 'Water Polo',
  SY: 'Artistic Swimming',
  HD: 'High Diving',
}

function formatDateRange(from: string, to: string, tbc: boolean) {
  if (tbc) return 'Date TBC'
  const f = new Date(from)
  const t = new Date(to)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  if (from === to) return f.toLocaleDateString('en-NZ', opts)
  // Same month+year — compress
  if (f.getMonth() === t.getMonth() && f.getFullYear() === t.getFullYear()) {
    return `${f.getDate()}–${t.getDate()} ${f.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })}`
  }
  return `${f.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} – ${t.toLocaleDateString('en-NZ', opts)}`
}

function WADateBox({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString('en-NZ', { month: 'short' }).toUpperCase()
  const day = d.getDate()
  return (
    <div className="flex-shrink-0 w-14 h-14 bg-ciaf-blue rounded-lg flex flex-col items-center justify-center shadow-sm">
      <span className="text-[10px] font-bold text-ciaf-sky uppercase tracking-widest">{month}</span>
      <span className="font-barlow-condensed font-extrabold text-2xl text-white leading-none">{day}</span>
    </div>
  )
}

function DisciplinePills({ disciplines }: { disciplines: string[] }) {
  const relevant = disciplines.filter((d) => d === 'SW' || d === 'OW')
  return (
    <div className="flex gap-1 flex-wrap">
      {relevant.map((d) => (
        <span key={d} className="discipline-pill bg-ciaf-sky/20 text-ciaf-blue text-[10px]">
          {DISCIPLINE_LABEL[d] ?? d}
        </span>
      ))}
    </div>
  )
}

export default function WorldAquaticsEvents() {
  const [events, setEvents] = useState<WACompetition[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/world-aquatics')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setEvents)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        Could not load World Aquatics calendar right now.
      </p>
    )
  }

  if (!events) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No upcoming events found.</p>
  }

  return (
    <div className="space-y-3">
      {events.slice(0, 20).map((event) => (
        <Link
          key={event.id}
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex gap-4 items-start p-4 bg-white rounded-lg border border-gray-100 hover:border-ciaf-sky hover:shadow-sm transition-all"
        >
          <WADateBox dateStr={event.venueDateFrom} />
          <div className="flex-1 min-w-0">
            <DisciplinePills disciplines={event.disciplines} />
            <p className="mt-1 font-semibold text-sm text-ciaf-navy group-hover:text-ciaf-blue transition-colors leading-snug">
              {event.name}
            </p>
            <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-gray-400">
              <span>{formatDateRange(event.venueDateFrom, event.venueDateTo, event.dateTbc)}</span>
              {event.location.city && (
                <span>📍 {event.location.city}, {event.location.countryName}</span>
              )}
            </div>
          </div>
          <span className="text-ciaf-sky text-sm self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </Link>
      ))}

      <p className="text-xs text-gray-400 text-center pt-2">
        Data from{' '}
        <a
          href="https://www.worldaquatics.com/competitions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          World Aquatics
        </a>
        {' '}· SW &amp; OW only
      </p>
    </div>
  )
}
