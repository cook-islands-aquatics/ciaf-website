import Link from 'next/link'
import type { Result } from '@/lib/types'

function MedalBadge({ place }: { place: number }) {
  if (place === 1) return <span title="Gold" className="text-yellow-400 text-lg">🥇</span>
  if (place === 2) return <span title="Silver" className="text-gray-400 text-lg">🥈</span>
  if (place === 3) return <span title="Bronze" className="text-amber-600 text-lg">🥉</span>
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
      {place}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

interface ResultsTableProps {
  results: Result[]
  compact?: boolean
}

export default function ResultsTable({ results, compact = false }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">No results to display.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-ciaf-navy text-white text-left">
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-12">Place</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Athlete</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Event</th>
            {!compact && <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs">Meet</th>}
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs hidden sm:table-cell">Date</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs hidden md:table-cell">Discipline</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {results.map((result, i) => (
            <tr key={result._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-ciaf-light/50 transition-colors`}>
              <td className="px-4 py-3 text-center">
                {result.place ? <MedalBadge place={result.place} /> : '—'}
              </td>
              <td className="px-4 py-3 font-semibold text-ciaf-navy">
                {result.athlete ? (
                  <Link href={`/athletes/${result.athlete.slug}`} className="hover:text-ciaf-blue transition-colors">
                    {result.athlete.name}
                  </Link>
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-gray-700">{result.event}</td>
              {!compact && <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{result.meet}</td>}
              <td className="px-4 py-3 text-gray-400 hidden sm:table-cell whitespace-nowrap">
                {formatDate(result.meetDate)}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="discipline-pill bg-ciaf-light text-ciaf-navy">{result.discipline}</span>
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-ciaf-navy">
                {result.time ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
