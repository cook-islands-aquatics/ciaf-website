import { defineField, defineType } from 'sanity'

export const athleteSchema = defineType({
  name: 'athlete',
  title: 'Athlete',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
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
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'achievements',
      title: 'Notable Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short achievement badges, e.g. "2x Olympian", "Pacific Champion"',
    }),
    defineField({
      name: 'personalBests',
      title: 'Personal Bests',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'event', title: 'Event', type: 'string' }),
            defineField({ name: 'time', title: 'Time', type: 'string' }),
            defineField({ name: 'date', title: 'Date', type: 'date' }),
            defineField({ name: 'meet', title: 'Meet / Competition', type: 'string' }),
          ],
          preview: {
            select: { title: 'event', subtitle: 'time' },
          },
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'discipline', media: 'photo' },
  },
})
