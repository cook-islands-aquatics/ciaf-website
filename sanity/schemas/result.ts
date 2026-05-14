import { defineField, defineType } from 'sanity'

export const resultSchema = defineType({
  name: 'result',
  title: 'Result',
  type: 'document',
  fields: [
    defineField({
      name: 'meet',
      title: 'Meet / Competition Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'meetDate',
      title: 'Meet Date',
      type: 'date',
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
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'string',
      description: 'e.g. "100m Freestyle", "10km Open Water"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'athlete',
      title: 'Athlete',
      type: 'reference',
      to: [{ type: 'athlete' }],
    }),
    defineField({
      name: 'time',
      title: 'Time / Result',
      type: 'string',
      description: 'e.g. "54.23", "2:01:45"',
    }),
    defineField({
      name: 'place',
      title: 'Place / Position',
      type: 'number',
      description: 'Final finishing position (1 = Gold, 2 = Silver, 3 = Bronze)',
    }),
  ],
  preview: {
    select: {
      title: 'event',
      subtitle: 'meet',
      athlete: 'athlete.name',
    },
    prepare({ title, subtitle, athlete }) {
      return { title: `${athlete ?? 'Unknown'} — ${title}`, subtitle }
    },
  },
  orderings: [
    { title: 'Meet Date (newest)', name: 'meetDateDesc', by: [{ field: 'meetDate', direction: 'desc' }] },
  ],
})
