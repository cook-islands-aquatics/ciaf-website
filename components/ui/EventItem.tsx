import Link from 'next/link'
import type { CIAFEvent } from '@/lib/types'

const DISCIPLINE_COLORS: Record<string, string> = {
  Swimming:    'bg-ciaf-sky/20 text-ciaf-blue',
  'Open Water': 'bg-blue-100 text-blue-700',
  Both:        'bg-ciaf-light text-ciaf-navy',
}

function DateBox({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString('en-NZ', { month: 'short' }).toUpperCase()
  const day = d.getDate()
  return (
    <div className="flex-shrink-0 w-14 h-14 bg-ciaf-navy rounded-lg flex flex-col items-center justify-center shadow-sm">
      <span className="text-[10px] font-bold text-ciaf-sky uppercase tracking-widest">{month}</span>
      <span className="font-barlow-condensed font-extrabold text-2xl text-white leading-none">{day}</span>
    </div>
  )
}

function formatDateRange(start: string, end?: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
  if (!end || end === start) return fmt(start)
  return `${fmt(start)} – ${fmt(end)}`
}

interface EventItemProps {
  event: CIAFEvent
}

export default function EventItem({ event }: EventItemProps) {
  const disciplineClass = DISCIPLINE_COLORS[event.discipline] ?? DISCIPLINE_COLORS.Swimming
  const isUpcoming = new Date(event.startDate) >= new Date()

  return (
    <div className="flex gap-5 items-start p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <DateBox dateStr={event.startDate} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={`discipline-pill ${disciplineClass}`}>{event.discipline}</span>
          {isUpcoming && (
            <span className="discipline-pill bg-green-100 text-green-700">Upcoming</span>
          )}
        </div>
        <h3 className="font-barlow-condensed font-extrabold text-xl text-ciaf-navy leading-tight">
          {event.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">📍 {event.location}</p>

        {event.externalLink && (
          <Link
            href={event.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors"
          >
            More Info →
          </Link>
        )}
      </div>
    </div>
  )
}
