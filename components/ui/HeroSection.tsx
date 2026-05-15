import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/lib/types'


interface CTA {
  text: string
  href: string
  variant?: 'primary' | 'outline'
}

interface HeroSectionProps {
  image?: SanityImage
  title: string
  subtitle?: string
  cta1?: CTA
  cta2?: CTA
  minHeight?: string
}

export default function HeroSection({
  image,
  title,
  subtitle,
  cta1 = { text: 'Explore Athletes', href: '/athletes', variant: 'primary' },
  cta2 = { text: 'View Results', href: '/results', variant: 'outline' },
  minHeight = 'min-h-[85vh]',
}: HeroSectionProps) {
  // Use Sanity image if set; fall back to the static hero photo
  const imgSrc = image ? urlFor(image).width(1920).height(900).url() : '/hero.jpg'

  return (
    <section className={`relative w-full ${minHeight} flex items-center overflow-hidden`}>
      {/* Background image */}
      <Image
        src={imgSrc}
        alt={image?.alt ?? title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark left gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

      {/* World Aquatics member badge — top right */}
      <div className="absolute top-5 right-5 z-10">
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3.5 flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Member</p>
          <Image
            src="/world-aquatics-logo.png"
            alt="World Aquatics"
            width={160}
            height={54}
            className="h-12 w-auto brightness-0 invert"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide w-full">
        <div className="max-w-2xl">
          {/* Federation label */}
          <p className="text-ciaf-sky text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Cook Islands Aquatics Federation
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-barlow-condensed font-extrabold text-white leading-[0.95] mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {cta1 && (
              <Link
                href={cta1.href}
                className="inline-block bg-ciaf-sky text-ciaf-navy px-7 py-3.5 rounded font-bold text-sm uppercase tracking-wide hover:bg-white transition-colors"
              >
                {cta1.text}
              </Link>
            )}
            {cta2 && (
              <Link
                href={cta2.href}
                className="inline-block border-2 border-white text-white px-7 py-3.5 rounded font-bold text-sm uppercase tracking-wide hover:bg-white hover:text-ciaf-navy transition-colors"
              >
                {cta2.text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  )
}
