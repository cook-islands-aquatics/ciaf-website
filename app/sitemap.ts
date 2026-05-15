import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { newsSlugsQuery, athleteSlugsQuery, coachOfficialSlugsQuery } from '@/lib/queries'

const BASE = 'https://cookislandsaquatics.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsSlugs, athleteSlugs, coachSlugs] = await Promise.all([
    sanityFetch<{ slug: string }[]>({ query: newsSlugsQuery, revalidate: 3600 }),
    sanityFetch<{ slug: string }[]>({ query: athleteSlugsQuery, revalidate: 3600 }),
    sanityFetch<{ slug: string }[]>({ query: coachOfficialSlugsQuery, revalidate: 3600 }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                        priority: 1.0,  changeFrequency: 'weekly' },
    { url: `${BASE}/athletes`,          priority: 0.9,  changeFrequency: 'weekly' },
    { url: `${BASE}/results`,           priority: 0.8,  changeFrequency: 'weekly' },
    { url: `${BASE}/news`,              priority: 0.8,  changeFrequency: 'daily'  },
    { url: `${BASE}/events`,            priority: 0.8,  changeFrequency: 'daily'  },
    { url: `${BASE}/coaches-officials`, priority: 0.7,  changeFrequency: 'monthly'},
    { url: `${BASE}/governance`,        priority: 0.6,  changeFrequency: 'monthly'},
    { url: `${BASE}/contact`,           priority: 0.6,  changeFrequency: 'yearly' },
  ]

  const newsRoutes: MetadataRoute.Sitemap = (newsSlugs ?? []).map((s) => ({
    url: `${BASE}/news/${s.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  const athleteRoutes: MetadataRoute.Sitemap = (athleteSlugs ?? []).map((s) => ({
    url: `${BASE}/athletes/${s.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  const coachRoutes: MetadataRoute.Sitemap = (coachSlugs ?? []).map((s) => ({
    url: `${BASE}/coaches-officials/${s.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  return [...staticRoutes, ...newsRoutes, ...athleteRoutes, ...coachRoutes]
}
