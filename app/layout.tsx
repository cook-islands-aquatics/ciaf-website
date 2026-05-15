import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { sanityFetch } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'
import type { SiteSettings } from '@/lib/types'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cook Islands Aquatics Federation',
    template: '%s | CIAF',
  },
  description:
    'Official website of the Cook Islands Aquatics Federation — representing Cook Islands in Swimming and Open Water on the world stage.',
  metadataBase: new URL('https://cookislandsaquatics.org'),
  openGraph: {
    siteName: 'Cook Islands Aquatics Federation',
    locale: 'en_NZ',
    type: 'website',
    url: 'https://cookislandsaquatics.org',
    images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: 'Cook Islands Aquatics Federation' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/hero.jpg'],
  },
  ...(process.env.NEXT_PUBLIC_FB_APP_ID && {
    other: { 'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID },
  }),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings =
    (await sanityFetch<SiteSettings | null>({ query: siteSettingsQuery }).catch(() => null)) ?? {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'Cook Islands Aquatics Federation',
    alternateName: 'CIAF',
    url: 'https://cookislandsaquatics.org',
    logo: 'https://cookislandsaquatics.org/ciaf-logo.png',
    sport: ['Swimming', 'Open Water Swimming'],
    email: settings.email ?? 'cookislandsaquatics@gmail.com',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'World Aquatics',
      url: 'https://www.worldaquatics.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Cook Islands',
    },
  }

  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main>
            {children}
            <SpeedInsights />
            <Analytics />
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
