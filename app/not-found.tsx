import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ciaf-light">
      <div className="text-center px-6">
        <p className="text-ciaf-sky font-barlow-condensed text-8xl font-extrabold leading-none">
          404
        </p>
        <h1 className="mt-4 text-4xl font-barlow-condensed font-extrabold text-ciaf-navy">
          Page Not Found
        </h1>
        <p className="mt-4 text-gray-500 max-w-sm mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          moved or no longer exists.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-ciaf-navy text-white px-6 py-3 rounded font-semibold hover:bg-ciaf-blue transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/news"
            className="border border-ciaf-navy text-ciaf-navy px-6 py-3 rounded font-semibold hover:bg-ciaf-light transition-colors"
          >
            Read News
          </Link>
        </div>
      </div>
    </div>
  )
}
