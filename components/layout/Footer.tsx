import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings: SiteSettings
}

const NAV_LINKS = [
  { label: 'News', href: '/news' },
  { label: 'Athletes', href: '/athletes' },
  { label: 'Results', href: '/results' },
  { label: 'Events', href: '/events' },
  { label: 'Coaches & Officials', href: '/coaches-officials' },
  { label: 'Governance', href: '/governance' },
  { label: 'Contact', href: '/contact' },
]

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ciaf-navy text-white">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              {/* White-filtered version of the logo for dark background */}
              <Image
                src="/ciaf-logo.png"
                alt="Cook Islands Aquatics Federation"
                width={160}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The national governing body for Swimming and Open Water in the Cook Islands.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src="/world-aquatics-logo.png"
                alt="World Aquatics"
                width={80}
                height={26}
                className="h-5 w-auto brightness-0 invert opacity-60"
              />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ciaf-sky/70">
                Member &amp; Oceania Swimming
              </span>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-ciaf-sky transition-colors"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-ciaf-sky transition-colors"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="text-gray-400 hover:text-ciaf-sky transition-colors"
                >
                  <XIcon />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && <li>{settings.phone}</li>}
              {settings.address && (
                <li className="leading-relaxed whitespace-pre-line">{settings.address}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {year} Cook Islands Aquatics Federation. All rights reserved.</p>
          <p>Built with Next.js &amp; Sanity</p>
        </div>
      </div>
    </footer>
  )
}
