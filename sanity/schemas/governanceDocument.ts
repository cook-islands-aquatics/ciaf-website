import { defineField, defineType } from 'sanity'

export const governanceDocumentSchema = defineType({
  name: 'governanceDocument',
  title: 'Governance Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Document Type',
      type: 'string',
      options: {
        list: [
          { title: 'Constitution', value: 'Constitution' },
          { title: 'Meeting Minutes', value: 'Meeting Minutes' },
          { title: 'Annual Report', value: 'Annual Report' },
          { title: 'Policy', value: 'Policy' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type' },
  },
  orderings: [
    { title: 'Date (newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
})
