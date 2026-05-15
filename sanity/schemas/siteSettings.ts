import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Cook Islands Aquatics Federation',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Representing Cook Islands in Swimming and Open Water on the world stage.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'info@cookislandsaquatics.org',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Mailing Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'stats',
      title: 'Stats Bar',
      type: 'array',
      description: 'Up to 4 stats shown in the banner below the hero. Leave empty to use defaults.',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "20+" or "2"' }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Olympic Athletes"' }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'X (Twitter) URL',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
