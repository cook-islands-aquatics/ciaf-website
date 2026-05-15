import { groq } from 'next-sanity'

// ─── Site Settings ────────────────────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    email, phone, address,
    facebook, instagram, twitter,
    heroImage { asset, alt, hotspot },
    heroTitle, heroSubtitle
  }
`

// ─── News ─────────────────────────────────────────────────────────────────────

export const newsListQuery = groq`
  *[_type == "news"] | order(publishedAt desc) {
    _id, title, "slug": slug.current,
    publishedAt, category, author, excerpt,
    coverImage { asset, alt, hotspot }
  }
`

export const newsByCategoryQuery = groq`
  *[_type == "news" && category == $category] | order(publishedAt desc) {
    _id, title, "slug": slug.current,
    publishedAt, category, author, excerpt,
    coverImage { asset, alt, hotspot }
  }
`

export const latestNewsQuery = groq`
  *[_type == "news"] | order(publishedAt desc) [0...3] {
    _id, title, "slug": slug.current,
    publishedAt, category, author, excerpt,
    coverImage { asset, alt, hotspot }
  }
`

export const newsArticleQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id, title, "slug": slug.current,
    publishedAt, category, author, excerpt,
    coverImage { asset, alt, hotspot },
    body
  }
`

export const newsSlugsQuery = groq`
  *[_type == "news" && defined(slug.current)] { "slug": slug.current }
`

// ─── Athletes ─────────────────────────────────────────────────────────────────

export const athletesListQuery = groq`
  *[_type == "athlete"] | order(name asc) {
    _id, name, "slug": slug.current,
    discipline, achievements,
    photo { asset, alt, hotspot },
    featured
  }
`

export const athletesByDisciplineQuery = groq`
  *[_type == "athlete" && (discipline == $discipline || discipline == "Both")] | order(name asc) {
    _id, name, "slug": slug.current,
    discipline, achievements,
    photo { asset, alt, hotspot },
    featured
  }
`

export const featuredAthletesQuery = groq`
  *[_type == "athlete" && featured == true] | order(name asc) [0...4] {
    _id, name, "slug": slug.current,
    discipline, achievements,
    photo { asset, alt, hotspot },
    featured
  }
`

export const athleteQuery = groq`
  *[_type == "athlete" && slug.current == $slug][0] {
    _id, name, "slug": slug.current,
    discipline, dateOfBirth, bio,
    photo { asset, alt, hotspot },
    achievements, personalBests, featured
  }
`

export const athleteSlugsQuery = groq`
  *[_type == "athlete" && defined(slug.current)] { "slug": slug.current }
`

// ─── Results ──────────────────────────────────────────────────────────────────

export const resultsListQuery = groq`
  *[_type == "result"] | order(meetDate desc) {
    _id, meet, meetDate, discipline, event, time, place,
    "athlete": athlete-> { name, "slug": slug.current }
  }
`

export const resultsByYearQuery = groq`
  *[_type == "result" && meetDate >= $yearStart && meetDate <= $yearEnd] | order(meetDate desc) {
    _id, meet, meetDate, discipline, event, time, place,
    "athlete": athlete-> { name, "slug": slug.current }
  }
`

export const resultsByDisciplineQuery = groq`
  *[_type == "result" && discipline == $discipline] | order(meetDate desc) {
    _id, meet, meetDate, discipline, event, time, place,
    "athlete": athlete-> { name, "slug": slug.current }
  }
`

export const recentResultsQuery = groq`
  *[_type == "result"] | order(meetDate desc) [0...4] {
    _id, meet, meetDate, discipline, event, time, place,
    "athlete": athlete-> { name, "slug": slug.current }
  }
`

// ─── Events ───────────────────────────────────────────────────────────────────

export const upcomingEventsQuery = groq`
  *[_type == "event" && startDate >= $now] | order(startDate asc) [0...3] {
    _id, name, startDate, endDate, location, discipline, description, externalLink
  }
`

export const allEventsQuery = groq`
  *[_type == "event"] | order(startDate desc) {
    _id, name, startDate, endDate, location, discipline, description, externalLink
  }
`

// ─── Coaches & Officials ──────────────────────────────────────────────────────

export const coachesOfficialsListQuery = groq`
  *[_type == "coachOfficial"] | order(name asc) {
    _id, name, "slug": slug.current,
    role, accreditationLevel,
    photo { asset, alt, hotspot },
    bio
  }
`

export const coachesByRoleQuery = groq`
  *[_type == "coachOfficial" && (role == $role || role == "Both")] | order(name asc) {
    _id, name, "slug": slug.current,
    role, accreditationLevel,
    photo { asset, alt, hotspot },
    bio
  }
`

export const coachOfficialQuery = groq`
  *[_type == "coachOfficial" && slug.current == $slug][0] {
    _id, name, "slug": slug.current,
    role, accreditationLevel,
    photo { asset, alt, hotspot },
    bio
  }
`

export const coachOfficialSlugsQuery = groq`
  *[_type == "coachOfficial" && defined(slug.current)] { "slug": slug.current }
`

// ─── Governance ───────────────────────────────────────────────────────────────

export const boardMembersQuery = groq`
  *[_type == "boardMember"] | order(name asc) {
    _id, name, role,
    photo { asset, alt, hotspot },
    termStart, termEnd
  }
`

export const governanceDocumentsQuery = groq`
  *[_type == "governanceDocument"] | order(date desc) {
    _id, title, type, date,
    "fileUrl": file.asset->url
  }
`
