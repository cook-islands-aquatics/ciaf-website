import { defineField, defineType } from 'sanity'

export const boardMemberSchema = defineType({
  name: 'boardMember',
  title: 'Executive Committee Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      description: 'e.g. "President", "Secretary General", "Treasurer"',
      validation: (Rule) => Rule.required(),
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
      name: 'termStart',
      title: 'Term Start',
      type: 'date',
    }),
    defineField({
      name: 'termEnd',
      title: 'Term End',
      type: 'date',
      description: 'Leave blank if currently serving',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
