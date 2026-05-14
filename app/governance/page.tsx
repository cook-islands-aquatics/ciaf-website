import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { boardMembersQuery, governanceDocumentsQuery } from '@/lib/queries'
import type { BoardMember, GovernanceDocument } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Governance',
  description: 'CIAF board members, constitution, meeting minutes and annual reports.',
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })
}

function BoardMemberCard({ member }: { member: BoardMember }) {
  const imgSrc = member.photo ? urlFor(member.photo).width(300).height(300).url() : null
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm text-center p-5">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-ciaf-light mx-auto mb-3">
        {imgSrc ? (
          <Image src={imgSrc} alt={member.name} fill className="object-cover object-top" sizes="80px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-10 h-10 text-ciaf-blue/30" fill="currentColor">
              <circle cx="32" cy="22" r="12" />
              <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24H8z" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-barlow-condensed font-extrabold text-lg text-ciaf-navy leading-tight">{member.name}</h3>
      <p className="text-sm font-semibold text-ciaf-blue mt-1">{member.role}</p>
      {(member.termStart || member.termEnd) && (
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(member.termStart)}
          {member.termEnd ? ` – ${formatDate(member.termEnd)}` : ' – Present'}
        </p>
      )}
    </div>
  )
}

function DocumentRow({ doc }: { doc: GovernanceDocument }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">📄</span>
        <div>
          <p className="font-semibold text-ciaf-navy text-sm">{doc.title}</p>
          <p className="text-xs text-gray-400">{formatDate(doc.date)}</p>
        </div>
      </div>
      {doc.fileUrl ? (
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-ciaf-blue hover:text-ciaf-navy uppercase tracking-wide transition-colors shrink-0 ml-4"
        >
          Download ↓
        </a>
      ) : (
        <span className="text-xs text-gray-300 ml-4">Unavailable</span>
      )}
    </div>
  )
}

export default async function GovernancePage() {
  const [boardMembers, allDocs] = await Promise.all([
    sanityFetch<BoardMember[]>({ query: boardMembersQuery }),
    sanityFetch<GovernanceDocument[]>({ query: governanceDocumentsQuery }),
  ])

  const docs = allDocs ?? []
  const constitution = docs.filter((d) => d.type === 'Constitution')
  const minutes = docs.filter((d) => d.type === 'Meeting Minutes')
  const reports = docs.filter((d) => d.type === 'Annual Report')
  const policies = docs.filter((d) => d.type === 'Policy')

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Governance"
          subtitle="CIAF is governed by an elected board and operates with full transparency through published documents."
        />

        {/* Board Members */}
        <section className="mb-14">
          <h2 className="font-barlow-condensed font-extrabold text-3xl text-ciaf-navy mb-2">Board of Directors</h2>
          <div className="h-1 w-12 bg-ciaf-sky rounded mb-6" />
          {boardMembers && boardMembers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {boardMembers.map((member) => (
                <BoardMemberCard key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Board member profiles coming soon.</p>
          )}
        </section>

        {/* Documents — grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Constitution */}
          <div className="bg-ciaf-light rounded-xl p-6">
            <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Constitution</h2>
            {constitution.length > 0 ? (
              constitution.map((doc) => <DocumentRow key={doc._id} doc={doc} />)
            ) : (
              <p className="text-sm text-gray-400">Not yet uploaded.</p>
            )}
          </div>

          {/* Meeting Minutes */}
          <div className="bg-ciaf-light rounded-xl p-6">
            <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Meeting Minutes</h2>
            {minutes.length > 0 ? (
              minutes.map((doc) => <DocumentRow key={doc._id} doc={doc} />)
            ) : (
              <p className="text-sm text-gray-400">No minutes published yet.</p>
            )}
          </div>

          {/* Annual Reports */}
          <div className="bg-ciaf-light rounded-xl p-6">
            <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Annual Reports</h2>
            {reports.length > 0 ? (
              reports.map((doc) => <DocumentRow key={doc._id} doc={doc} />)
            ) : (
              <p className="text-sm text-gray-400">No reports published yet.</p>
            )}
          </div>

          {/* Policies */}
          <div className="bg-ciaf-light rounded-xl p-6">
            <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-4">Policies</h2>
            {policies.length > 0 ? (
              policies.map((doc) => <DocumentRow key={doc._id} doc={doc} />)
            ) : (
              <p className="text-sm text-gray-400">No policies published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
