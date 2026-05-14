import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { PortableTextBlock } from '@/lib/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 text-gray-700 leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="font-barlow-condensed font-extrabold text-3xl text-ciaf-navy mb-4 mt-10">{children}</h2>,
    h3: ({ children }) => <h3 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-3 mt-8">{children}</h3>,
    h4: ({ children }) => <h4 className="font-barlow-condensed font-extrabold text-xl text-ciaf-navy mb-2 mt-6">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-ciaf-sky pl-5 italic text-gray-600 mb-5 ml-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-ciaf-blue underline hover:text-ciaf-navy transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside mb-5 space-y-1.5 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-5 space-y-1.5 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const src = urlFor(value).width(800).url()
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image src={src} alt={value.alt ?? ''} fill className="object-cover" />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-400 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextRendererProps {
  value: PortableTextBlock[]
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />
}
