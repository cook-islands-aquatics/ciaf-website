import { NextResponse } from 'next/server'

const WA_BASE = 'https://api.worldaquatics.com'

export interface WAAthletePhoto {
  athleteId: number
  imageUrl: string      // raw URL — append ?width=N for resizing
  onDemandUrl: string
}

export interface WAAthleteRaw {
  id: number
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  nationality: string
  gender: 'M' | 'F'
  disciplines: string[]
  height?: number
  metadata: Record<string, unknown>
}

export interface WAAthleteWithPhoto extends WAAthleteRaw {
  photo: WAAthletePhoto | null
  profileUrl: string
}

export async function GET() {
  try {
    // ── 1. Fetch all COK athletes ──────────────────────────────────────────
    const athleteRes = await fetch(
      `${WA_BASE}/fina/athletes?nationality=COK&pageSize=100&page=0`,
      { next: { revalidate: 3600 }, headers: { Accept: 'application/json' } }
    )
    if (!athleteRes.ok) throw new Error('Athletes fetch failed')

    const athleteData = await athleteRes.json()
    const athletes: WAAthleteRaw[] = athleteData.content ?? []

    if (athletes.length === 0) {
      return NextResponse.json([])
    }

    // ── 2. Build referenceExpression for photo lookup ──────────────────────
    const refExpr = athletes
      .map((a) => `"FINA_ATHLETE:${a.id}"`)
      .join(' or ')

    const photoRes = await fetch(
      `${WA_BASE}/content/fina/photo/en/?limit=200&tagNames=athlete-image&referenceExpression=${encodeURIComponent(refExpr)}`,
      { next: { revalidate: 3600 }, headers: { Accept: 'application/json' } }
    )

    // ── 3. Build a map: athleteId → most-recent photo ─────────────────────
    const photoMap = new Map<number, WAAthletePhoto>()

    if (photoRes.ok) {
      const photoData = await photoRes.json()
      // Photos come newest-first; first match per athlete wins
      for (const item of (photoData.content ?? [])) {
        const ref = item.references?.[0]
        if (!ref || ref.type !== 'FINA_ATHLETE') continue
        const athleteId = Number(ref.id)
        if (!photoMap.has(athleteId) && item.onDemandUrl) {
          photoMap.set(athleteId, {
            athleteId,
            imageUrl: item.imageUrl,
            onDemandUrl: item.onDemandUrl,
          })
        }
      }
    }

    // ── 4. Merge and return ────────────────────────────────────────────────
    const result: WAAthleteWithPhoto[] = athletes.map((a) => {
      const slug = a.fullName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return {
        ...a,
        photo: photoMap.get(a.id) ?? null,
        profileUrl: `https://www.worldaquatics.com/athletes/${a.id}/${slug}/profile`,
      }
    })

    // Sort: athletes with photos first, then alphabetically
    result.sort((a, b) => {
      if (a.photo && !b.photo) return -1
      if (!a.photo && b.photo) return 1
      return a.lastName.localeCompare(b.lastName)
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('WA athletes fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 })
  }
}
