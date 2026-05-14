'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { sendContactForm, type ContactFormState } from './actions'

const INITIAL: ContactFormState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-ciaf-navy text-white px-8 py-3.5 rounded font-bold text-sm uppercase tracking-wide hover:bg-ciaf-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  )
}

export default function ContactForm() {
  const [state, action] = useFormState(sendContactForm, INITIAL)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-ciaf-sky focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-ciaf-sky focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
          Subject <span className="text-red-400">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What is your enquiry about?"
          className="w-full px-4 py-3 rounded border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-ciaf-sky focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us more..."
          className="w-full px-4 py-3 rounded border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-ciaf-sky focus:border-transparent transition resize-none"
        />
      </div>

      {/* Status message */}
      {state.status !== 'idle' && (
        <div
          className={`px-4 py-3 rounded text-sm font-medium ${
            state.status === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
