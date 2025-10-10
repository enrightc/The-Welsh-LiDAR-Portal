import React from 'react' // Import React library


// Importing CSS for styling and components
import '../assets/styles/Home.css';
import LidarFooter from "../Components/LidarFooter";
import Support from "../Components/Support";
import BetaNoticeModal from "../Components/BetaNoticeModal";
import SupportButton from "../Components/SupportButton";


// Image Imports
import mapScreenImage from '../Components/Assets/MapScreenImage.webp';
import rhydBrownCamp from '../Components/Assets/RhydBrownCamp.webp';
import mapMarkerIcon from '../Components/Assets/map_marker.svg';
import addIcon from '../Components/Assets/add.svg';
import speechIcon from '../Components/Assets/speech.svg';
import lidarMapWales from '../Components/Assets/lidarMapWales.webp';

const Home = () => {
  return (
    <>
    <BetaNoticeModal
        storage="session" // once per tab/session
        storageKey="wlidar_seen_beta_v1"  // bump to _v2 to re-show after updates
      />

      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero__text">
              <p className="eyebrow-text">The Welsh LiDAR Portal</p>
              <h1 className="hero__title">Discover the <span className="accent">Past, </span>Shape<span className="accent"> the Record</span></h1>
              <p className="hero__tagline">Search, explore and contribute to the map of Wales’ archaeological heritage.</p>
              <div className="hero__btns">
                <a href="/lidarPortal" className="btn btn--primary">Start Exploring</a>
                <a href="/Register" className="btn btn--secondary">Register</a>
                
              </div> 
            </div>         
          </div> 
        </div>
      </header> 

      <main>
        <section className="about" aria-labelledby="about-title">
          <div className="container content reverse-content">
              <div className="about-text">
              <h2 id="about-title" className="about-text__title">About the Welsh LiDAR Portal</h2>
              <p>The Welsh LiDAR portal is a free, interactive tool that lets you discover the hidden archaeology across Wales using high resolution LiDAR data.</p>
              <p>This portal is designed for everyone: whether you're a local resident, a student, a heritage professional, or just curious about the past.</p>
              <p>You can explore the map, record new discoveries, and help improve our understanding of Wales' rich archaeological landscape.</p>
              <a href="/About" className="btn btn--tertiary">Read More</a>
              
            </div>
            <div className="about-image">
              <img src={mapScreenImage} alt="Screenshot of main mapping screen polygon drawn and form open as example"></img>
            </div>
          </div>
        </section>

        <section className="explore-heritage" aria-labelledby="explore-heritage-title">
          <div className="container content content">
            <div className="explore-heritage__text">
              <h2 id="explore-heritage-title" className="explore-heritage__title">Explore Wales' heritage</h2>
              <p>Our interactive map lets you explore archaeological features across Wales using LiDAR data. You can view the shape of the land in detail and see things like ancient monuments, old field boundaries, and signs of past human activity that may not be visible on the ground.</p>
              <p>By using LiDAR, we can spot patterns in the landscape that help us understand how places were used in the past. This tool is designed to support research, learning, and public interest in Wales’ rich historic environment.</p>
            </div>
            <div className="explore-heritage__img">
              <img src={lidarMapWales} alt="LiDAR view of Rhyd Brown Camp Hillfort" loading="lazy"/>
            </div>
          </div> 
        </section>

        <section className="how-it-works" aria-labelledby="how-it-works-title">
          <div className="container">
            <h2 id="how-it-works-title" className="how-it-works__title">How it works</h2>
            <ul className="cards content">
              <li>
                <article className="card explore">
                  <img className="card-icon" src={mapMarkerIcon} alt="" aria-hidden="true"
                  />
                  <h3>Explore the map</h3>
                  <p>View the LiDAR map of Wales and find hidden archaeological sites.</p>
                </article>
              </li>
              <li>
                <article className="card add">
                  <img className="card-icon" src={addIcon} alt="" aria-hidden="true"/>
                  <h3>Add a discovery</h3>
                  <p>Record your finds directly on the interactive map.</p>
                </article>
              </li>
              <li>
                <article className="card community">
                  <img className="card-icon" src={speechIcon} alt="" aria-hidden="true"/>
                  <h3>Help the Community</h3>
                  <p>Your finds help to build a better picture of Wales' past.</p>
                </article>
              </li> 
            </ul>
          </div>
          <a href="/howItWorks" className="btn btn--tertiary how-it-works-link">Read More</a>
        </section>

        <section className="what-is-lidar" aria-labelledby="what-is-lidar-title">
          <div className="container content reverse-content">
            <div className="what-is-lidar__text">
              <h2 id="what-is-lidar-title" className="what-is-lidar__text__title">What is LiDAR?</h2>
              <p><em>Light Detection and Ranging (LiDAR)</em> is a remote sensing method that uses laser pulses to measure the shape of the land. These pulses are usually sent from an aircraft, and by calculating the time it takes for the light to bounce back, LiDAR builds a highly detailed 3D map of the ground surface.</p>
              <p>What makes LiDAR especially useful for archaeology is its ability to ‘see through’ trees and vegetation, revealing bumps, ditches, and other subtle features that might be hard to spot in person or on aerial photos. This helps archaeologists and researchers find and record sites that might otherwise remain hidden.</p>
              <a href="/whatIsLidar" className="btn btn--tertiary lidar-info">Read More</a>
            </div>
            <div className="what-is-lidar__img">
              <img src={rhydBrownCamp} alt="Lidar view of Rudbaxton Rath" loading="lazy"/>
            </div>
          </div>
        </section>

        
      </main> 

      <Support />
      <LidarFooter />
      
    </>
  )
}
// Export the Home component so it can be used in other files
export default Home