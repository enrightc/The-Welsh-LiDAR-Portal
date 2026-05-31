import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import profileIconUrl from '../assets/icons/profileIcon.svg'
import magnifyingIconUrl from '../assets/icons/magnifyingIcon.svg'
import recordIconUrl from '../assets/icons/recordIcon.svg'
import mapIconUrl from '../assets/icons/mapIcon.svg'
import completedRecordIconUrl from '../assets/icons/completedRecordIcon.svg'

import LidarFooter from '../Components/LidarFooter'
import Support from '../Components/Support'

import '../assets/styles/Home.css'
import '../assets/styles/how-it-works.css'

const steps = [
  {
    number: '01',
    icon: profileIconUrl,
    alt: 'Profile icon',
    title: 'Register & Login',
    body: 'Create a free account to unlock the ability to add and manage archaeological records on the portal.',
  },
  {
    number: '02',
    icon: mapIconUrl,
    alt: 'Map icon',
    title: 'Visit the LiDAR Portal',
    body: 'All users can browse existing records, but only logged-in users can create new ones. Head to the portal to get started.',
  },
  {
    number: '03',
    icon: magnifyingIconUrl,
    alt: 'Magnifying glass icon',
    title: 'Search the map',
    body: 'Pan and zoom around the LiDAR map looking for landscape features — earthworks, enclosures, field boundaries — that could be of archaeological origin.',
  },
  {
    number: '04',
    icon: recordIconUrl,
    alt: 'Record icon',
    title: 'Check for existing records',
    body: "Before creating a new entry, click the feature to check whether it's already been recorded by another user.",
  },
  {
    number: '05',
    icon: completedRecordIconUrl,
    alt: 'Completed record icon',
    title: 'Complete the recording form',
    body: 'Fill in the form with details about what you have found and save your record to add it to the community database.',
  },
]

function HowItWorks() {
  useEffect(() => {
    document.title = 'How It Works | Welsh LiDAR Portal'
  }, [])

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <h1 className="hero__title">How to Add Records on the <span className="accent">Welsh LiDAR Portal</span></h1>
              <p className="hero__tagline">A simple five-step guide to exploring and contributing to Wales' archaeological record.</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hiw-section" aria-labelledby="hiw-title">
          <div className="container">
            <h2 id="hiw-title" className="hiw-section__title">Getting started</h2>
            <p className="hiw-section__intro">
              Follow these steps to start exploring the LiDAR map and contribute your own archaeological discoveries.
            </p>

            <ol className="hiw-steps">
              {steps.map((step) => (
                <li key={step.number} className="hiw-step">
                  <span className="hiw-step__number" aria-hidden="true">{step.number}</span>
                  <img className="hiw-step__icon" src={step.icon} alt={step.alt} />
                  <div className="hiw-step__content">
                    <h3 className="hiw-step__title">{step.title}</h3>
                    <p className="hiw-step__body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Support />
      <LidarFooter />
    </>
  )
}

export default HowItWorks
