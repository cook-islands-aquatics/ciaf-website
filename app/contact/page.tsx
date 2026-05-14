import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'
import type { SiteSettings } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import ContactForm from './ContactForm'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Cook Islands Aquatics Federation.',
}

export default async function ContactPage() {
  const settings: SiteSettings =
    (await sanityFetch<SiteSettings | null>({ query: siteSettingsQuery }).catch(() => null)) ?? {}

  return (
    <div className="py-14 bg-white min-h-screen">
      <div className="container-wide">
        <PageHeader
          title="Contact Us"
          subtitle="Questions, media enquiries, or partnership opportunities — we'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-ciaf-light rounded-xl p-6 sm:p-8">
              <h2 className="font-barlow-condensed font-extrabold text-2xl text-ciaf-navy mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact details + map placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ciaf-navy text-white rounded-xl p-6">
              <h2 className="font-barlow-condensed font-extrabold text-2xl mb-4">Get in Touch</h2>
              <ul className="space-y-3 text-sm text-white/80">
                {settings.email && (
                  <li className="flex gap-3 items-start">
                    <span className="text-ciaf-sky shrink-0 mt-0.5">✉</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex gap-3 items-start">
                    <span className="text-ciaf-sky shrink-0 mt-0.5">☎</span>
                    <span>{settings.phone}</span>
                  </li>
                )}
                {settings.address && (
                  <li className="flex gap-3 items-start">
                    <span className="text-ciaf-sky shrink-0 mt-0.5">📍</span>
                    <span className="whitespace-pre-line">{settings.address}</span>
                  </li>
                )}
              </ul>

              {(settings.facebook || settings.instagram || settings.twitter) && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {settings.facebook && (
                      <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-ciaf-sky hover:text-white transition-colors uppercase tracking-wide">
                        Facebook
                      </a>
                    )}
                    {settings.instagram && (
                      <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-ciaf-sky hover:text-white transition-colors uppercase tracking-wide">
                        Instagram
                      </a>
                    )}
                    {settings.twitter && (
                      <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-ciaf-sky hover:text-white transition-colors uppercase tracking-wide">
                        X / Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="bg-ciaf-light h-56 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-3xl mb-2">🗺</p>
                  <p className="text-sm font-medium">Rarotonga, Cook Islands</p>
                  <p className="text-xs mt-1 text-gray-300">Map embed — configure in CMS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
