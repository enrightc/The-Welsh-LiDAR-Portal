import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import LidarFooter from '../Components/LidarFooter'
import Support from '../Components/Support'

import '../assets/styles/Home.css'
import '../assets/styles/about.css'

const features = [
  { title: 'Explore and Discover', body: 'Use the map to find hidden archaeological features in LiDAR.' },
  { title: 'Record and Describe', body: 'Draw polygons to mark discoveries. Add notes, photos, or ideas.' },
  { title: 'Learn and Share', body: 'Grow your archaeological knowledge and share what you find with others.' },
  { title: 'Support Research', body: 'Add to a growing, open dataset that supports research and heritage protection.' },
  { title: 'Track Your Journey', body: 'Keep a personal record of everything you\'ve found — and return to it anytime.' },
  { title: 'Customise Your Profile', body: 'Personalise your profile with a bio, profile picture, and discovery history.' },
  { title: 'Zoom and Switch Views', body: 'Navigate by zooming, panning, and switching between different map backgrounds.' },
  { title: 'Sign Up and Log In', body: 'Create a free account to start recording and saving your own discoveries.' },
  { title: 'View Other Records', body: 'See what others have found and explore the growing community dataset.' },
  { title: 'Give Feedback', body: 'Send ideas, bug reports, or suggestions to help improve the portal.' },
]

const comingSoon = [
  { title: 'Advanced Filters', body: 'Search and display recorded LiDAR features by type, date, or contributor.' },
  { title: 'Additional Map Layers', body: 'LiDAR DTM, OS maps, and historic maps for richer context.' },
  { title: 'Draft Records', body: 'Save unfinished records as drafts and return to complete them later.' },
  { title: 'Export & Share', body: 'Download discoveries as GeoJSON, shapefiles, or images.' },
  { title: 'Mobile Uploads', body: 'Take photos in the field and link them directly to your recorded finds.' },
  { title: 'Badges & Milestones', body: 'Earn recognition for contributions like "First Find" or "100 Records Added."' },
]

const About = () => {
  useEffect(() => {
    document.title = 'About | Welsh LiDAR Portal'
  }, [])

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">About the <span className="accent">Welsh LiDAR Portal</span></h1>
              <p className="hero__tagline">An independent platform making Wales' LiDAR data open for exploration and discovery.</p>
            </div>
          </div>
        </div>
      </header>

      <main>

        {/* Intro */}
        <section className="about-intro" aria-labelledby="about-intro-title">
          <div className="container">
            <h2 id="about-intro-title" className="about-intro__title">What is the Welsh LiDAR Portal?</h2>
            <p>
              <strong>The Welsh LiDAR Portal</strong> is an independent project built to make Wales' incredible
              LiDAR data open for exploration and discovery. Wales has nationwide 1m LiDAR coverage — some of
              the best in the UK — but until now there hasn't been a dedicated platform for recording archaeology
              on it. This project was created to change that.
            </p>
            <p>
              The portal is a <strong>community science platform</strong> where anyone can:
            </p>
            <ul className="about-bullet-list">
              <li>Explore LiDAR maps of Wales</li>
              <li>Discover archaeological features like barrows, enclosures, or field systems</li>
              <li>Record finds by drawing them directly on the map</li>
              <li>Save and manage discoveries in a personal profile</li>
              <li>Contribute to a growing, shared record of Wales' past</li>
            </ul>
            <p style={{ marginTop: '1.5rem' }}>
              Our aim is to turn passive map viewers into active contributors, giving both beginners and
              experienced researchers the tools to explore, learn, and collaborate.
            </p>

            <div className="beta-callout">
              <p className="beta-callout__label">Beta Release</p>
              <p>
                This is an early version of the Welsh LiDAR Portal. Features are still being developed,
                and you may encounter changes or small issues as we continue to improve. Your feedback
                will help shape the final platform.
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Do */}
        <section className="about-features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="about-features__title">What You Can Do</h2>
            <p className="about-features__intro">
              Everything available to you on the portal right now.
            </p>
            <div className="features-grid">
              {features.map((f) => (
                <div key={f.title} className="feature-card">
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__body">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="about-coming-soon" aria-labelledby="coming-soon-title">
          <div className="container">
            <h2 id="coming-soon-title" className="about-coming-soon__title">Coming Soon</h2>
            <p className="about-coming-soon__intro">
              Features currently in development or planned for upcoming releases.
            </p>
            <div className="coming-soon-grid">
              {comingSoon.map((item) => (
                <div key={item.title} className="coming-soon-item">
                  <span className="coming-soon-item__dot" aria-hidden="true" />
                  <div>
                    <p className="coming-soon-item__title">{item.title}</p>
                    <p className="coming-soon-item__body">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data & Licensing */}
        <section className="about-data" aria-labelledby="data-title">
          <div className="container">
            <h2 id="data-title" className="about-data__title">Data & Licensing</h2>
            <p>The data displayed on this site is provided by third parties and is not owned by this project.</p>
            <ul className="data-list">
              <li>
                LiDAR data is provided by{' '}
                <a href="https://datamap.gov.wales/" target="_blank" rel="noopener noreferrer">DataMapWales</a>{' '}
                and licensed under the{' '}
                <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">
                  Open Government Licence v3.0
                </a>.
              </li>
              <li>
                Scheduled Monument data is owned by{' '}
                <a href="https://cadw.gov.wales/" target="_blank" rel="noopener noreferrer">Cadw</a>{' '}
                and licensed under the{' '}
                <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">
                  Open Government Licence v3.0
                </a>.
              </li>
              <li>
                National Monuments Record of Wales (NMRW) data is produced by the Royal Commission on
                the Ancient and Historical Monuments of Wales (RCAHMW).
                © Crown Database Right {new Date().getFullYear()}, licensed under the{' '}
                <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">
                  Open Government Licence v3.0
                </a>.
              </li>
            </ul>
          </div>
        </section>

        {/* Feedback strip */}
        <div className="about-feedback-strip">
          <div className="container">
            <p>
              Have feedback or ideas? We'd love to hear from you —{' '}
              <Link to="/feedback">leave us a message</Link>.
            </p>
          </div>
        </div>

      </main>

      <Support />
      <LidarFooter />
    </>
  )
}

export default About
