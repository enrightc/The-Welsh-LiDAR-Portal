import { useState, useEffect } from 'react'
import LidarFooter from './LidarFooter'
import Support from './Support'

import '../assets/styles/Home.css'
import '../assets/styles/feedback.css'

export default function Feedback() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Feedback | Welsh LiDAR Portal'
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/manpnrbq', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Thanks! Your feedback was sent.' })
        form.reset()
      } else {
        setStatus({ type: 'error', message: 'Sorry, something went wrong. Please try again.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">Send us <span className="accent">Feedback</span></h1>
              <p className="hero__tagline">Bug reports, feature ideas, or general thoughts — we'd love to hear from you.</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="feedback-section" aria-labelledby="feedback-title">
          <div className="container">
            <h2 id="feedback-title" className="feedback-section__title">Get in touch</h2>
            <p className="feedback-section__intro">
              Let us know about any bugs you spot, features you'd like to see, or anything you think
              could be improved. If you're reporting a bug, please describe what you were doing and
              the steps to reproduce it.
            </p>

            <div className="feedback-card">
              <form className="feedback-form" onSubmit={handleSubmit}>

                <div className="form-field">
                  <label htmlFor="feedback-name">Your name <span style={{ fontWeight: 400, color: '#6b7a8a' }}>(optional)</span></label>
                  <input id="feedback-name" type="text" name="name" placeholder="Your name" />
                </div>

                <div className="form-field">
                  <label htmlFor="feedback-email">Your email <span style={{ fontWeight: 400, color: '#6b7a8a' }}>(optional)</span></label>
                  <input id="feedback-email" type="email" name="email" placeholder="you@example.com" />
                </div>

                <div className="form-field">
                  <label htmlFor="feedback-message">Message <span style={{ color: '#b91c1c' }}>*</span></label>
                  <textarea id="feedback-message" name="message" required placeholder="Your feedback..." />
                </div>

                <input type="hidden" name="_subject" value="New Welsh LiDAR Portal feedback" />
                <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />

                {status && (
                  <p className={`feedback-status feedback-status--${status.type}`}>
                    {status.message}
                  </p>
                )}

                <button type="submit" className="feedback-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send feedback'}
                </button>

              </form>
            </div>
          </div>
        </section>
      </main>

      <Support />
      <LidarFooter />
    </>
  )
}
