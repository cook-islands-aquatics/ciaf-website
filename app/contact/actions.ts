'use server'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function sendContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const subject = formData.get('subject')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (!name || !email || !subject || !message) {
    return { status: 'error', message: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'info@cookislandsaquatics.org'

  if (apiKey) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)

      await resend.emails.send({
        from: 'Cook Islands Aquatics Federation <info@cookislandsaquatics.org>',
        to: [toEmail],
        reply_to: email,
        subject: `[CIAF Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      })

      return { status: 'success', message: 'Your message has been sent. We\'ll be in touch soon.' }
    } catch (err) {
      console.error('Resend error:', err)
      return { status: 'error', message: 'Failed to send message. Please try again or email us directly.' }
    }
  }

  // Fallback — log to console in development
  console.info('[Contact form submission]', { name, email, subject, message })
  return {
    status: 'success',
    message: 'Message received (email sending not configured — set RESEND_API_KEY to enable).',
  }
}
