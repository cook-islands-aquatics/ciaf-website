import { defineField, defineType } from 'sanity'

export const eventSchema = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Event Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discipline',
      title: 'Discipline',
      type: 'string',
      options: {
        list: [
          { title: 'Swimming', value: 'Swimming' },
          { title: 'Open Water', value: 'Open Water' },
          { title: 'Both', value: 'Both' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link (optional)',
      type: 'url',
      description: 'Link to official event website or registration page',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'startDate' },
  },
  orderings: [
    { title: 'Start Date (soonest)', name: 'startDateAsc', by: [{ field: 'startDate', direction: 'asc' }] },
    { title: 'Start Date (newest)', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
})
