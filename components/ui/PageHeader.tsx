interface PageHeaderProps {
  title: string
  subtitle?: string
  center?: boolean
}

export default function PageHeader({ title, subtitle, center = false }: PageHeaderProps) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <h1 className="font-barlow-condensed font-extrabold text-4xl sm:text-5xl text-ciaf-navy">
        {title}
      </h1>
      {/* Navy underline accent */}
      <div className={`mt-3 h-1 w-16 bg-ciaf-sky rounded ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className="mt-4 text-gray-500 max-w-2xl text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
