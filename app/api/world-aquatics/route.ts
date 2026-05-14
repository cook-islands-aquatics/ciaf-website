import { NextResponse } from 'next/server'

const WA_API = 'https://api.worldaquatics.com/fina/competitions'

export interface WACompetition {
  id: number
  name: string
  venueDateFrom: string
  venueDateTo: string
  dateTbc: boolean
  location: {
    city: string
    countryName: string
    countryCode: string
  }
  disciplines: string[]
  competitionType: {
    name: string
    code: string
  }
  url: string
}

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch 3 years ahead so Olympics 2028 always shows
    const future = new Date(today)
    future.setFullYear(future.getFullYear() + 3)

    const params = new URLSearchParams({
      pageSize: '100',
      page: '0',
      venueDateFrom: today.toISOString(),
      venueDateTo: future.toISOString(),
      disciplines: 'SW,OW',
      group: 'FINA',
      sort: 'dateFrom,asc',
    })

    const res = await fetch(`${WA_API}?${params}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'World Aquatics API error' }, { status: 502 })
    }

    const data = await res.json()

    const competitions: WACompetition[] = (data.content ?? []).map((c: any): WACompetition => ({
      id: c.id,
      name: c.name,
      venueDateFrom: c.venueDateFrom ?? c.dateFrom,
      venueDateTo: c.venueDateTo ?? c.dateTo,
      dateTbc: c.dateTbc ?? false,
      location: {
        city: c.location?.city ?? '',
        countryName: c.location?.countryName ?? '',
        countryCode: c.location?.countryCode ?? '',
      },
      disciplines: c.disciplines ?? [],
      competitionType: {
        name: c.competitionType?.name ?? '',
        code: c.competitionType?.code ?? '',
      },
      url: `https://www.worldaquatics.com/competitions/${c.id}`,
    }))

    return NextResponse.json(competitions)
  } catch (err) {
    console.error('World Aquatics fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
