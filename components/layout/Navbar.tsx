'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'News', href: '/news' },
  { label: 'Athletes', href: '/athletes' },
  { label: 'Results', href: '/results' },
  { label: 'Events', href: '/events' },
  { label: 'Coaches & Officials', href: '/coaches-officials' },
  { label: 'Governance', href: '/governance' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Don't render nav inside the studio
  if (pathname?.startsWith('/studio')) return null

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/ciaf-logo.png"
              alt="Cook Islands Aquatics Federation"
              width={140}
              height={52}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                    active
                      ? 'text-ciaf-navy bg-ciaf-light'
                      : 'text-gray-600 hover:text-ciaf-navy hover:bg-ciaf-light'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded text-ciaf-navy hover:bg-ciaf-light transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="container-wide py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded transition-colors ${
                    active
                      ? 'text-ciaf-navy bg-ciaf-light'
                      : 'text-gray-600 hover:text-ciaf-navy hover:bg-ciaf-light'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
