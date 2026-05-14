import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('CIAF Website')
    .items([
      S.listItem()
        .title('Content')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('news').title('News'),
              S.documentTypeListItem('athlete').title('Athletes'),
              S.documentTypeListItem('result').title('Results'),
              S.documentTypeListItem('event').title('Events'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('People')
        .icon(() => '👤')
        .child(
          S.list()
            .title('People')
            .items([
              S.documentTypeListItem('coachOfficial').title('Coaches & Officials'),
              S.documentTypeListItem('boardMember').title('Board Members'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Governance')
        .icon(() => '📋')
        .child(
          S.list()
            .title('Governance')
            .items([
              S.documentTypeListItem('governanceDocument').title('Documents'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
    ])
