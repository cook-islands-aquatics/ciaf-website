export interface SanityImageAsset {
  _ref: string
  _type: 'reference'
}

export interface SanityImage {
  _type: 'image'
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
}

export interface SanityFileAsset {
  url: string
}

export interface News {
  _id: string
  title: string
  slug: string
  publishedAt: string
  category: 'General' | 'Competition' | 'Development' | 'Governance'
  author?: string
  excerpt?: string
  coverImage?: SanityImage
  body?: PortableTextBlock[]
}

export interface PersonalBest {
  event: string
  time: string
  date?: string
  meet?: string
}

export interface Athlete {
  _id: string
  name: string
  slug: string
  discipline: 'Swimming' | 'Open Water' | 'Both'
  dateOfBirth?: string
  bio?: PortableTextBlock[]
  photo?: SanityImage
  achievements?: string[]
  personalBests?: PersonalBest[]
  featured: boolean
}

export interface Result {
  _id: string
  meet: string
  meetDate: string
  discipline: 'Swimming' | 'Open Water'
  event: string
  time?: string
  place?: number
  athlete?: {
    name: string
    slug: string
  }
}

export interface CIAFEvent {
  _id: string
  name: string
  startDate: string
  endDate?: string
  location: string
  discipline: 'Swimming' | 'Open Water' | 'Both'
  description?: PortableTextBlock[]
  externalLink?: string
}

export interface CoachOfficial {
  _id: string
  name: string
  slug: string
  role: 'Coach' | 'Official' | 'Both'
  accreditationLevel?: string
  photo?: SanityImage
  bio?: PortableTextBlock[]
}

export interface BoardMember {
  _id: string
  name: string
  role: string
  photo?: SanityImage
  termStart?: string
  termEnd?: string
}

export interface GovernanceDocument {
  _id: string
  title: string
  type: 'Constitution' | 'Meeting Minutes' | 'Annual Report' | 'Policy'
  date: string
  fileUrl?: string
}

export interface Stat {
  value: string
  label: string
}

export interface SiteSettings {
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  twitter?: string
  heroImage?: SanityImage
  heroTitle?: string
  heroSubtitle?: string
  stats?: Stat[]
}

// Minimal portable text block type (avoid importing the full lib in types)
export type PortableTextBlock = {
  _type: string
  _key?: string
  [key: string]: unknown
}
