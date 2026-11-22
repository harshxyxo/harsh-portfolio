import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { HoverFlipText } from '../HoverFlipText'

export function ContactSection({ profile }) {
  const [copyStatus, setCopyStatus] = useState('')
  const copyStatusTimerRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', project: '' })
  const revealRef = useReveal()

  useEffect(() => () => window.clearTimeout(copyStatusTimerRef.current), [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyStatus('Copied to clipboard.')
      window.clearTimeout(copyStatusTimerRef.current)
      copyStatusTimerRef.current = window.setTimeout(() => setCopyStatus(''), 2400)
    } catch {
      window.clearTimeout(copyStatusTimerRef.current)
      setCopyStatus('Clipboard access failed. Select and copy the email address above.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project inquiry from ${formData.name || 'Portfolio visitor'}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nProject details:\n${formData.project}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="contact-section section-pad reveal-section" ref={revealRef} aria-labelledby="contact-heading-title">
      <div className="wrap">
        <div className="contact-layout">
          {/* Left Column: Opening, Direct Email & Verified Socials */}
          <div className="contact-opening">
            <div>
              <p className="section-eyebrow">Get in touch</p>
              <h2 id="contact-heading-title">Let&apos;s talk.</h2>
            </div>
            <p className="contact-lead">
              Whether it&apos;s an opportunity, a software project, or an engineering conversation, my inbox is open.
            </p>

            <div className="contact-details">
              <div className="email-block">
                <a className="email-link hover-flip-link" href={`mailto:${profile.email}`}>
                  <HoverFlipText text={profile.email} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
                <button
                  type="button"
                  className="icon-button copy-email"
                  aria-label="Copy email address"
                  onClick={handleCopyEmail}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
              <span className="copy-status" role="status" aria-live="polite">
                {copyStatus}
              </span>

              {/* Verified Social Links */}
              <div className="social-links" aria-label="Social profiles">
                {profile.linkedin && (
                  <a
                    className="hover-flip-link"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Harsh Sharma on LinkedIn"
                  >
                    <svg
                      className="platform-logo"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <HoverFlipText text="LinkedIn" />
                  </a>
                )}

                {profile.github && (
                  <a
                    className="hover-flip-link"
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Harsh Sharma on GitHub"
                  >
                    <svg
                      className="platform-logo"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <HoverFlipText text="GitHub" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Reference Two-Field Input & Textarea Mail Draft Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="inquiry-name">Your name</label>
              <input
                id="inquiry-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="What should I call you?"
                autoComplete="name"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="inquiry-email">Email address</label>
              <input
                id="inquiry-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-field contact-message">
              <label htmlFor="inquiry-project">What do you have in mind?</label>
              <textarea
                id="inquiry-project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                placeholder="A little about your opportunity, project, or question…"
                rows={4}
                required
              />
            </div>

            <div className="contact-submit">
              <button className="button draft-button" type="submit">
                <span>Create email draft</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
