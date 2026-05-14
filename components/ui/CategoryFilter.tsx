'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface CategoryFilterProps {
  categories: string[]
  paramName?: string
  allLabel?: string
}

export default function CategoryFilter({
  categories,
  paramName = 'category',
  allLabel = 'All',
}: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const current = searchParams.get(paramName) ?? allLabel

  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === allLabel) {
      params.delete(paramName)
    } else {
      params.set(paramName, value)
    }
    startTransition(() => {
      router.push(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false })
    })
  }

  return (
    <div className={`flex flex-wrap gap-2 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {[allLabel, ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            current === cat
              ? 'bg-ciaf-navy text-white shadow-sm'
              : 'bg-white text-ciaf-navy border border-gray-200 hover:border-ciaf-navy hover:bg-ciaf-light'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
