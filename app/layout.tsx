import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { sanityFetch } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'
import type { SiteSettings } from '@/lib/types'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  metadataBase: new URL('https://ciaf.ck'),
  openGraph: {
    siteName: 'Cook Islands Aquatics Federation',
    locale: 'en_NZ',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings =
    (await sanityFetch<SiteSettings | null>({ query: siteSettingsQuery }).catch(() => null)) ?? {}

  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer settings={settings} />
        <SpeedInsights />
      </body>
    </html>
  )
}
