import type { Stat } from '@/lib/types'

const DEFAULT_STATS: Stat[] = [
  { value: '2', label: 'Olympic Games' },
  { value: '2', label: 'Disciplines — Swimming & Open Water' },
  { value: '140+', label: 'World Aquatics Member Nations' },
]

interface StatsBarProps {
  stats?: Stat[] | null
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = stats && stats.length > 0 ? stats : DEFAULT_STATS
  return (
    <div className="bg-ciaf-navy text-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {items.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-7 px-6 text-center">
              <span className="font-barlow-condensed font-extrabold text-4xl text-ciaf-sky leading-none">
                {stat.value}
              </span>
              <span className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
